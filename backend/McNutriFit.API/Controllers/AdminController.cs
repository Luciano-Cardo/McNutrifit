using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using McNutriFit.API.Data;
using McNutriFit.API.Models;

namespace McNutriFit.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/admin/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalOrders = await _db.Orders.CountAsync();
        var paidOrders = await _db.Orders.CountAsync(o => o.Status == "paid");
        var totalRevenue = await _db.Orders
            .Where(o => o.Status == "paid")
            .SumAsync(o => o.Total);
        var totalProducts = await _db.Products.CountAsync(p => p.IsActive);

        return Ok(new { totalOrders, paidOrders, totalRevenue, totalProducts });
    }

    // GET /api/admin/orders
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _db.Orders
            .Include(o => o.Items)
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                o.Id,
                customerEmail = o.User.Email,
                o.Total,
                o.Status,
                o.DiscountApplied,
                o.CouponCode,
                o.CreatedAt,
                items = o.Items.Select(i => new
                {
                    i.ProductName,
                    i.Price,
                    i.Quantity
                })
            })
            .ToListAsync();

        return Ok(orders);
    }

    // GET /api/admin/coupons
    [HttpGet("coupons")]
    public async Task<IActionResult> GetCoupons()
    {
        var coupons = await _db.Coupons.OrderByDescending(c => c.CreatedAt).ToListAsync();
        return Ok(coupons);
    }

    // POST /api/admin/coupons
    [HttpPost("coupons")]
    public async Task<IActionResult> CreateCoupon([FromBody] Coupon coupon)
    {
        _db.Coupons.Add(coupon);
        await _db.SaveChangesAsync();
        return Ok(coupon);
    }

    // PATCH /api/admin/coupons/5
    [HttpPatch("coupons/{id}")]
    public async Task<IActionResult> ToggleCoupon(int id, [FromBody] ToggleCouponRequest req)
    {
        var coupon = await _db.Coupons.FindAsync(id);
        if (coupon is null) return NotFound();
        coupon.IsActive = req.IsActive;
        await _db.SaveChangesAsync();
        return Ok(coupon);
    }
}

public record ToggleCouponRequest(bool IsActive);