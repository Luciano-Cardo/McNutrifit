using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using McNutriFit.API.Data;
using McNutriFit.API.DTOs;
using McNutriFit.API.Models;

namespace McNutriFit.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProductsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category)
    {
        var query = _db.Products
            .Where(p => p.IsActive)
            .AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(p => p.Category == category);

        var products = await query
            .OrderBy(p => p.Id)
            .Select(p => new ProductResponse(
                p.Id, p.Name, p.Description, p.Price,
                p.OriginalPrice, p.Category, p.ImageUrl, p.IsActive))
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await _db.Products.FindAsync(id);

        if (p is null || !p.IsActive)
            return NotFound(new { message = "Producto no encontrado" });

        return Ok(new ProductResponse(
            p.Id, p.Name, p.Description, p.Price,
            p.OriginalPrice, p.Category, p.ImageUrl, p.IsActive));
    }

    [HttpGet("{id}/download")]
    [Authorize]
    public async Task<IActionResult> Download(int id)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

        var userProduct = await _db.UserProducts
            .Include(up => up.Product)
            .FirstOrDefaultAsync(up => up.UserId == userId && up.ProductId == id);

        if (userProduct is null)
            return Forbid();

        if (string.IsNullOrEmpty(userProduct.Product.FileUrl))
            return NotFound(new { message = "El archivo no está disponible aún" });

        return Ok(new ProductDownloadResponse(
            userProduct.Product.Id,
            userProduct.Product.Name,
            userProduct.Product.FileUrl));
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CreateProductRequest req)
    {
        var product = new Product
        {
            Name = req.Name,
            Description = req.Description,
            Price = req.Price,
            OriginalPrice = req.OriginalPrice,
            Category = req.Category,
            ImageUrl = req.ImageUrl,
            FileUrl = req.FileUrl
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = product.Id },
            new ProductResponse(product.Id, product.Name, product.Description,
                product.Price, product.OriginalPrice, product.Category,
                product.ImageUrl, product.IsActive));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductRequest req)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return NotFound();

        product.Name = req.Name;
        product.Description = req.Description;
        product.Price = req.Price;
        product.OriginalPrice = req.OriginalPrice;
        product.Category = req.Category;
        product.ImageUrl = req.ImageUrl;
        product.FileUrl = req.FileUrl;
        product.IsActive = req.IsActive;

        await _db.SaveChangesAsync();
        return Ok(new ProductResponse(product.Id, product.Name, product.Description,
            product.Price, product.OriginalPrice, product.Category,
            product.ImageUrl, product.IsActive));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return NotFound();

        product.IsActive = false;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
