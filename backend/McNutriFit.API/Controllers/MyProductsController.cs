using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using McNutriFit.API.Data;
using McNutriFit.API.DTOs;
using System.Security.Claims;

namespace McNutriFit.API.Controllers;

[ApiController]
[Route("api/my-products")]
[Authorize]
public class MyProductsController : ControllerBase
{
    private readonly AppDbContext _db;

    public MyProductsController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/my-products
    // Devuelve todos los planes que el usuario compró
    [HttpGet]
    public async Task<IActionResult> GetMyProducts()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var products = await _db.UserProducts
            .Include(up => up.Product)
            .Where(up => up.UserId == userId)
            .Select(up => new MyProductResponse(
                up.ProductId,
                up.Product.Name,
                up.Product.ImageUrl,
                up.Product.Category,
                up.PurchasedAt))
            .ToListAsync();

        return Ok(products);
    }
}
