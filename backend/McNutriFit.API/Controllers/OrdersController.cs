using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using McNutriFit.API.Data;
using McNutriFit.API.DTOs;
using McNutriFit.API.Models;
using System.Security.Claims;
using System.Text.Json;
using System.Text;

namespace McNutriFit.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly ILogger<OrdersController> _logger;
    private readonly HttpClient _httpClient;

    public OrdersController(AppDbContext db, IConfiguration config, ILogger<OrdersController> logger, IHttpClientFactory httpClientFactory)
    {
        _db = db;
        _config = config;
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient("MercadoPago");
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest req)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var productIds = req.Items.Select(i => i.ProductId).ToList();
        var products = await _db.Products
            .Where(p => productIds.Contains(p.Id) && p.IsActive)
            .ToDictionaryAsync(p => p.Id);

        if (products.Count != productIds.Count)
            return BadRequest(new { message = "Uno o más productos no existen" });

        decimal discount = 0;
        string? couponCode = null;
        decimal subtotal = req.Items.Sum(i => products[i.ProductId].Price * i.Quantity);

        if (!string.IsNullOrEmpty(req.CouponCode))
        {
            var coupon = await _db.Coupons
                .FirstOrDefaultAsync(c => c.Code.ToUpper() == req.CouponCode.ToUpper() && c.IsActive);

            if (coupon != null && (!coupon.ExpiresAt.HasValue || coupon.ExpiresAt > DateTime.UtcNow)
                && (!coupon.MaxUses.HasValue || coupon.TimesUsed < coupon.MaxUses))
            {
                discount = coupon.Type == "percentage"
                    ? subtotal * (coupon.Discount / 100)
                    : coupon.Discount;
                couponCode = coupon.Code;
            }
        }

        var total = Math.Max(0, subtotal - discount);

        var order = new Order
        {
            UserId = userId,
            Total = total,
            DiscountApplied = discount,
            CouponCode = couponCode,
            Items = req.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductName = products[i.ProductId].Name,
                Price = products[i.ProductId].Price,
                Quantity = i.Quantity
            }).ToList()
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        // Crear preferencia en MercadoPago
        var frontendUrl = _config["Frontend:Url"];
        var accessToken = _config["MercadoPago:AccessToken"];

        var preference = new
{
    items = req.Items.Select(i => new
    {
        title = products[i.ProductId].Name,
        quantity = i.Quantity,
        unit_price = (double)products[i.ProductId].Price,
        currency_id = "ARS"
    }).ToList(),
    external_reference = order.Id.ToString(),
    notification_url = "https://TU-BACKEND-EN-PRODUCCION/api/orders/webhook"
};

        var json = JsonSerializer.Serialize(preference);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

        var mpResponse = await _httpClient.PostAsync("https://api.mercadopago.com/checkout/preferences", content);
        var mpBody = await mpResponse.Content.ReadAsStringAsync();

        if (!mpResponse.IsSuccessStatusCode)
        {
            _logger.LogError("Error MP: {Body}", mpBody);
            return StatusCode(500, new { message = "Error al crear el pago en MercadoPago" });
        }

        var mpData = JsonSerializer.Deserialize<JsonElement>(mpBody);
        var initPoint = mpData.GetProperty("init_point").GetString();
        var sandboxInitPoint = mpData.GetProperty("sandbox_init_point").GetString();

        // Guardar el ID de preferencia en la orden
        order.MpPaymentId = mpData.GetProperty("id").GetString();
        await _db.SaveChangesAsync();

        return Ok(new
        {
            orderId = order.Id,
            total = order.Total,
            paymentUrl = sandboxInitPoint // En producción usar init_point
        });
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> MyOrders()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var orders = await _db.Orders
            .Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderResponse(
                o.Id, o.Total, o.Status, o.DiscountApplied, o.CouponCode, o.CreatedAt,
                o.Items.Select(i => new OrderItemResponse(i.ProductName, i.Price, i.Quantity)).ToList()))
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {
        using var reader = new StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync();

        _logger.LogInformation("Webhook MP recibido: {Body}", body);

        try
        {
            var payload = JsonSerializer.Deserialize<JsonElement>(body);
            var type = payload.GetProperty("type").GetString();
            if (type != "payment") return Ok();

            var paymentId = payload.GetProperty("data").GetProperty("id").GetString();
            if (string.IsNullOrEmpty(paymentId)) return Ok();

            var order = await _db.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.MpPaymentId == paymentId);

            if (order is null) return Ok();
            if (order.Status != "pending") return Ok();

            order.Status = "paid";

            foreach (var item in order.Items)
            {
                var alreadyHas = await _db.UserProducts
                    .AnyAsync(up => up.UserId == order.UserId && up.ProductId == item.ProductId);

                if (!alreadyHas)
                {
                    _db.UserProducts.Add(new UserProduct
                    {
                        UserId = order.UserId,
                        ProductId = item.ProductId,
                        OrderId = order.Id
                    });
                }
            }

            if (!string.IsNullOrEmpty(order.CouponCode))
            {
                var coupon = await _db.Coupons.FirstOrDefaultAsync(c => c.Code == order.CouponCode);
                if (coupon != null) coupon.TimesUsed++;
            }

            await _db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error procesando webhook de MP");
        }

        return Ok();
    }
}