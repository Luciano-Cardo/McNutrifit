namespace McNutriFit.API.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "customer"; // "usuario" | "admin"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<Order> Orders { get; set; } = new();
    public List<UserProduct> UserProducts { get; set; } = new();
}

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public string Category { get; set; } = string.Empty; 
    public string? ImageUrl { get; set; }
    public string? FileUrl { get; set; } 
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Coupon
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public decimal Discount { get; set; }
    public string Type { get; set; } = "percentage"; 
    public bool IsActive { get; set; } = true;
    public DateTime? ExpiresAt { get; set; }
    public int? MaxUses { get; set; }
    public int TimesUsed { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = "pending"; // "pendiente" | "pagado" | "cancelado"
    public string? MpPaymentId { get; set; }
    public string? CouponCode { get; set; }
    public decimal DiscountApplied { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public List<OrderItem> Items { get; set; } = new();
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; } = 1;

    public Order Order { get; set; } = null!;
    public Product Product { get; set; } = null!;
}

public class UserProduct
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public int OrderId { get; set; }
    public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Product Product { get; set; } = null!;
    public Order Order { get; set; } = null!;
}
