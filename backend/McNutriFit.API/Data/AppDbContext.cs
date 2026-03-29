using Microsoft.EntityFrameworkCore;
using McNutriFit.API.Models;

namespace McNutriFit.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<UserProduct> UserProducts => Set<UserProduct>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Un usuario no puede tener el mismo producto dos veces
        modelBuilder.Entity<UserProduct>()
            .HasIndex(up => new { up.UserId, up.ProductId })
            .IsUnique();

        // El código de cupón es único
        modelBuilder.Entity<Coupon>()
            .HasIndex(c => c.Code)
            .IsUnique();

        // El email de usuario es único
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Índices de performance
        modelBuilder.Entity<Order>()
            .HasIndex(o => o.MpPaymentId);

        modelBuilder.Entity<Order>()
            .HasIndex(o => o.Status);
    }
}
