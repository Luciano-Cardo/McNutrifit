# McNutriFit - Backend API

## Requisitos
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server (ya tenés la base de datos creada con el script .sql)
- VS Code + extensión C# Dev Kit

## Setup inicial

### 1. Restaurar dependencias
```bash
cd backend/McNutriFit.API
dotnet restore
```

### 2. Configurar appsettings.json
Abrí `appsettings.json` y completá:
- `ConnectionStrings:DefaultConnection` → tu cadena de conexión a SQL Server
- `Jwt:Key` → una clave secreta larga (mínimo 32 caracteres)
- `MercadoPago:AccessToken` → tu token de MP (lo configurás cuando llegues a esa parte)

### 3. Correr el proyecto
```bash
dotnet run
```

La API queda en:
- http://localhost:5000
- Swagger UI: http://localhost:5000/swagger

---

## Endpoints

### Auth
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/register | ❌ | Registrar usuario |
| POST | /api/auth/login | ❌ | Login, devuelve JWT |

### Productos
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/products | ❌ | Listar productos activos |
| GET | /api/products?category=masa-muscular | ❌ | Filtrar por categoría |
| GET | /api/products/{id} | ❌ | Detalle de producto |
| GET | /api/products/{id}/download | ✅ Usuario | Descargar PDF (solo si compró) |
| POST | /api/products | ✅ Admin | Crear producto |
| PUT | /api/products/{id} | ✅ Admin | Editar producto |
| DELETE | /api/products/{id} | ✅ Admin | Desactivar producto |

### Cupones
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/coupons/validate | ✅ Usuario | Validar un cupón |

### Órdenes
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/orders | ✅ Usuario | Crear orden + iniciar pago |
| GET | /api/orders/my | ✅ Usuario | Historial de compras |
| POST | /api/orders/webhook | ❌ | Webhook de MercadoPago |

### Mis productos
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/my-products | ✅ Usuario | PDFs comprados por el usuario |

---

## Flujo de compra completo

```
1. Usuario agrega productos al carrito (frontend)
2. POST /api/orders → se crea la orden en estado "pending"
3. Se crea preferencia en MercadoPago → se devuelve URL de pago
4. Usuario paga en MercadoPago
5. MP llama a POST /api/orders/webhook
6. El webhook marca la orden como "paid" y crea registros en UserProducts
7. El usuario ya puede acceder a GET /api/products/{id}/download
```

## Próximo paso: MercadoPago
En `OrdersController.cs` buscá el comentario `// TODO: Crear preferencia de pago en MercadoPago`
y agregá el SDK de MP:
```bash
dotnet add package MercadoPago.net
```
