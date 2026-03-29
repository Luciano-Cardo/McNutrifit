import { useEffect, useState } from 'react'
import api from '../../services/api'

interface Order {
  id: number
  customerEmail: string
  total: number
  status: string
  discountApplied: number
  couponCode?: string
  createdAt: string
  items: { productName: string; price: number; quantity: number }[]
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    api.get('/admin/orders')
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })

  const statusColor = (status: string) => {
    if (status === 'paid') return 'bg-green-900 text-green-400'
    if (status === 'cancelled') return 'bg-red-900 text-red-400'
    return 'bg-yellow-900 text-yellow-400'
  }

  const statusLabel = (status: string) => {
    if (status === 'paid') return 'Pagado'
    if (status === 'cancelled') return 'Cancelado'
    return 'Pendiente'
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black text-white mb-8">Órdenes</h1>

      {loading ? (
        <p className="text-gray-400">Cargando órdenes...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400">No hay órdenes todavía.</p>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-zinc-800">
              <tr>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">#</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Cliente</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Total</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Estado</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Fecha</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <>
                  <tr key={order.id} className="border-b border-zinc-800 last:border-0">
                    <td className="px-6 py-4 text-gray-400 text-sm">#{order.id}</td>
                    <td className="px-6 py-4 text-white text-sm">{order.customerEmail}</td>
                    <td className="px-6 py-4 text-white font-bold">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${statusColor(order.status)}`}>
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                        className="text-blue-400 hover:text-blue-300 text-sm transition"
                      >
                        {expanded === order.id ? 'Ocultar' : 'Ver'}
                      </button>
                    </td>
                  </tr>
                  {expanded === order.id && (
                    <tr key={`detail-${order.id}`} className="border-b border-zinc-800 bg-zinc-800">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="space-y-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-300">{item.productName} x{item.quantity}</span>
                              <span className="text-white">{formatPrice(item.price)}</span>
                            </div>
                          ))}
                          {order.couponCode && (
                            <div className="flex justify-between text-sm border-t border-zinc-700 pt-2 mt-2">
                              <span className="text-green-400">Cupón: {order.couponCode}</span>
                              <span className="text-green-400">-{formatPrice(order.discountApplied)}</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}