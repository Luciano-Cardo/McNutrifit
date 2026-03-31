import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { validateCoupon, createOrder } from '../services/api'

export default function Cart() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const {
    items, removeItem, clearCart,
    couponCode, discount, applyCoupon, removeCoupon,
    getTotal, getTotalWithDiscount
  } = useCartStore()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)

  const handleValidateCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    setCouponError('')
    try {
      const res = await validateCoupon(couponInput, getTotal())
      applyCoupon(res.data.code, res.data.discount)
      setCouponInput('')
    } catch {
      setCouponError('Cupón inválido o vencido')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleCheckout = async () => {
  if (!isAuthenticated) {
    navigate('/login')
    return
  }

  setOrderLoading(true)
  try {
    const items_req = items.map(i => ({ productId: i.product.id, quantity: i.quantity }))
    const res = await createOrder(items_req, couponCode || undefined)
    clearCart()
    window.location.href = res.data.paymentUrl
  } catch {
    alert('Error al crear la orden. Intentá de nuevo.')
  } finally {
    setOrderLoading(false)
  }
}

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 min-h-screen" style={{ textAlign: "center", paddingTop: '50px' }}>
        <p className="text-gray-400 text-xl mb-6">Tu carrito está vacío</p>
        <Link
          to="/productos"
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition">
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">Tu carrito</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-16 h-16 bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">PDF</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold">{product.name}</h3>
                <p className="text-gray-400 text-sm">Cantidad: {quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">
                  {formatPrice(product.price * quantity)}
                </p>
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-red-500 hover:text-red-400 text-sm mt-1 transition">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit space-y-5">
          <h2 className="text-white font-bold text-lg">Resumen</h2>
          {couponCode ? (
            <div className="bg-zinc-800 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-bold">{couponCode} aplicado</p>
                <p className="text-gray-400 text-xs">-{formatPrice(discount)}</p>
              </div>
              <button
                onClick={removeCoupon}
                className="text-gray-500 hover:text-red-400 text-xs transition">
                Quitar
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">¿Tenés un cupón?</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="CÓDIGO"
                  className="flex-1 bg-zinc-800 text-white rounded-lg px-3 py-2 text-sm border border-zinc-700 focus:outline-none focus:border-red-500 transition"/>
                <button
                  onClick={handleValidateCoupon}
                  disabled={couponLoading}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded-lg text-sm transition">
                  {couponLoading ? '...' : 'Aplicar'}
                </button>
              </div>
              {couponError && <p className="text-red-500 text-xs">{couponError}</p>}
            </div>
          )}
          <div className="space-y-2 border-t border-zinc-800 pt-4">
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-400 text-sm">
                <span>Descuento</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold text-lg border-t border-zinc-800 pt-2">
              <span>Total</span>
              <span>{formatPrice(getTotalWithDiscount())}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={orderLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition">
            {orderLoading ? 'Procesando...' : 'Finalizar compra'}
          </button>
          <p className="text-gray-500 text-xs text-center">
            Al comprar aceptás los términos y condiciones
          </p>
        </div>
      </div>
    </div>
  )
}