namespace McNutriFit.API.DTOs;

// ── AUTH ──────────────────────────────────────────
public record RegisterRequest(string Name, string Email, string Password);

public record LoginRequest(string Email, string Password);

public record AuthResponse(string Token, string Name, string Email, string Role);

// ── PRODUCTS ──────────────────────────────────────
public record ProductResponse(
    int Id,
    string Name,
    string Description,
    decimal Price,
    decimal? OriginalPrice,
    string Category,
    string? ImageUrl,
    bool IsActive
);
// Nota: FileUrl NO está en este DTO porque no se expone en el catálogo público

public record ProductDownloadResponse(
    int Id,
    string Name,
    string FileUrl  // Solo se devuelve cuando el usuario ya compró el producto
);

public record CreateProductRequest(
    string Name,
    string Description,
    decimal Price,
    decimal? OriginalPrice,
    string Category,
    string? ImageUrl,
    string? FileUrl
);

public record UpdateProductRequest(
    string Name,
    string Description,
    decimal Price,
    decimal? OriginalPrice,
    string Category,
    string? ImageUrl,
    string? FileUrl,
    bool IsActive
);

// ── COUPONS ───────────────────────────────────────
public record ValidateCouponRequest(string Code, decimal CartTotal);

public record CouponResponse(
    string Code,
    decimal Discount,
    string Type,
    decimal FinalTotal
);

// ── ORDERS ────────────────────────────────────────
public record CreateOrderRequest(
    List<OrderItemRequest> Items,
    string? CouponCode
);

public record OrderItemRequest(int ProductId, int Quantity);

public record OrderResponse(
    int Id,
    decimal Total,
    string Status,
    decimal DiscountApplied,
    string? CouponCode,
    DateTime CreatedAt,
    List<OrderItemResponse> Items
);

public record OrderItemResponse(
    string ProductName,
    decimal Price,
    int Quantity
);

// ── MERCADOPAGO ───────────────────────────────────
public record CheckoutResponse(string PaymentUrl, int OrderId);

// ── MY PRODUCTS (mis compras) ─────────────────────
public record MyProductResponse(
    int ProductId,
    string Name,
    string? ImageUrl,
    string Category,
    DateTime PurchasedAt
);
