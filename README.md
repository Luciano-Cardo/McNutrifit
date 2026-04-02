# MCNutriFit

 

E-commerce de planes nutricionales y rutinas de entrenamiento digitales. Los clientes compran, pagan con MercadoPago y acceden a sus planes al instante desde su cuenta.

 

---

 

## Stack tecnológico

 

**Frontend**

- React 18 + TypeScript

- Vite

- Tailwind CSS

- React Router DOM

- Zustand

- Axios

 

**Backend**

- ASP.NET Core 8 (C#)

- Entity Framework Core

- JWT Authentication

- BCrypt

- Swagger

 

**Base de datos**

- SQL Server

 

**Pagos**

- MercadoPago Checkout Pro

 

---

 

## Estructura del proyecto

 

```

mcnutrifit/

├── backend/

│   └── McNutriFit.API/

│       ├── Controllers/

│       ├── Models/

│       ├── Data/

│       ├── DTOs/

│       └── Services/

├── frontend/

│   └── src/

│       ├── components/

│       ├── pages/

│       │   └── admin/

│       ├── services/

│       ├── store/

│       └── hooks/

└── README.md

```

 

---

 

## Funcionalidades

 

### Clientes

- Registro e inicio de sesión

- Catálogo de planes con filtros por categoría

- Carrito de compras con cupones de descuento

- Pago con MercadoPago

- Descarga de PDFs post-pago desde "Mis planes"

 

### Panel de administración

- Dashboard con estadísticas (órdenes, ingresos, productos)

- Gestión de productos (crear, editar, desactivar)

- Historial de órdenes

- Gestión de cupones de descuento

 

---

 

## Instalación y configuración

 

### Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

- [Node.js LTS](https://nodejs.org/)

- SQL Server

- Cuenta de MercadoPago Developers

 

---

 

## Variables de entorno importantes

 

| Variable | Descripción |

|----------|-------------|

| `ConnectionStrings:DefaultConnection` | Cadena de conexión a SQL Server |

| `Jwt:Key` | Clave secreta para firmar tokens JWT (mínimo 32 caracteres) |

| `MercadoPago:AccessToken` | Access Token de MercadoPago |

| `Frontend:Url` | URL del frontend (para CORS) |

 

---

 

## Endpoints principales

 

### Auth

| Método | Ruta | Descripción |

|--------|------|-------------|

| POST | /api/auth/register | Registrar usuario |

| POST | /api/auth/login | Iniciar sesión |

 

### Productos

| Método | Ruta | Descripción |

|--------|------|-------------|

| GET | /api/products | Listar productos |

| GET | /api/products/{id} | Detalle de producto |

| GET | /api/products/{id}/download | Descargar PDF (requiere compra) |

 

### Órdenes

| Método | Ruta | Descripción |

|--------|------|-------------|

| POST | /api/orders | Crear orden y obtener link de pago |

| GET | /api/orders/my | Historial de compras |

| POST | /api/orders/webhook | Webhook de MercadoPago |

 

### Admin

| Método | Ruta | Descripción |

|--------|------|-------------|

| GET | /api/admin/stats | Estadísticas del negocio |

| GET | /api/admin/orders | Todas las órdenes |

| GET | /api/admin/coupons | Todos los cupones |

| POST | /api/admin/coupons | Crear cupón |

 

---

 

## Licencia

 

Proyecto privado — MCNutriFit © 2026
