using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using McNutriFit.API.Data;
using McNutriFit.API.DTOs;
using McNutriFit.API.Models;
using McNutriFit.API.Services;

namespace McNutriFit.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext db, TokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            return BadRequest(new { message = "El email ya está registrado" });

        var user = new User
        {
            Name = req.Name,
            Email = req.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Name, user.Email, user.Role));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email.ToLower());

        if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Email o contraseña incorrectos" });

        var token = _tokenService.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Name, user.Email, user.Role));
    }
}