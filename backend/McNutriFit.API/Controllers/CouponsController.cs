using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using McNutriFit.API.Data;
using McNutriFit.API.DTOs;

namespace McNutriFit.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouponsController : ControllerBase
{
    private readonly AppDbContext _db;

    public CouponsController(AppDbContext db)
    {
        _db = db;
    }

    // El frontend llama a esto cuando el usuario escribe un cupón en el carrito
    [HttpPost("validate")]
    [Authorize]
    public async Task<IActionResult> Validate([FromBody] ValidateCouponRequest req)
    {
        var coupon = await _db.Coupons
            .FirstOrDefaultAsync(c => c.Code.ToUpper() == req.Code.ToUpper() && c.IsActive);

        if (coupon is null)
            return BadRequest(new { message = "El cupón no existe o no es válido" });

        if (coupon.ExpiresAt.HasValue && coupon.ExpiresAt < DateTime.UtcNow)
            return BadRequest(new { message = "El cupón está vencido" });

        if (coupon.MaxUses.HasValue && coupon.TimesUsed >= coupon.MaxUses)
            return BadRequest(new { message = "El cupón ya alcanzó su límite de usos" });

        var discount = coupon.Type == "percentage"
            ? req.CartTotal * (coupon.Discount / 100)
            : coupon.Discount;

        var finalTotal = Math.Max(0, req.CartTotal - discount);

        return Ok(new CouponResponse(coupon.Code, discount, coupon.Type, finalTotal));
    }
}
