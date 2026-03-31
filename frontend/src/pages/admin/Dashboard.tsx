import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

interface Stats {
  totalOrders: number
  paidOrders: number
  totalRevenue: number
  totalProducts: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    paidOrders: 0,
    totalRevenue: 0,
    totalProducts: 0
  })

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(console.error)
  }, [])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 min-h-screen" style={{paddingTop: '50px' }}>
      <h1 className="text-3xl font-black text-white mb-2">Panel de administración</h1>
      <p className="text-gray-400 mb-10">Bienvenida al dashboard de MCNutriFit</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" style={{paddingTop: '20px' }}>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Total órdenes</p>
          <p className="text-3xl font-black text-white">{stats.totalOrders}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Órdenes pagadas</p>
          <p className="text-3xl font-black text-green-400">{stats.paidOrders}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Ingresos totales</p>
          <p className="text-3xl font-black text-white">{formatPrice(stats.totalRevenue)}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Productos activos</p>
          <p className="text-3xl font-black text-white">{stats.totalProducts}</p>
        </div>
      </div>
      <h2 className="text-xl font-bold text-white mb-6">Accesos rápidos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/admin/productos"
          className="bg-zinc-900 border border-zinc-800 hover:border-red-600 rounded-2xl p-8 text-center transition">
          <p className="text-4xl mb-4">📦</p>
          <h3 className="text-white font-bold text-lg mb-1">Productos</h3>
          <p className="text-gray-400 text-sm">Agregar, editar y desactivar planes</p>
        </Link>
        <Link
          to="/admin/ordenes"
          className="bg-zinc-900 border border-zinc-800 hover:border-red-600 rounded-2xl p-8 text-center transition">
          <p className="text-4xl mb-4">🧾</p>
          <h3 className="text-white font-bold text-lg mb-1">Órdenes</h3>
          <p className="text-gray-400 text-sm">Ver todas las compras realizadas</p>
        </Link>
        <Link
          to="/admin/cupones"
          className="bg-zinc-900 border border-zinc-800 hover:border-red-600 rounded-2xl p-8 text-center transition">
          <p className="text-4xl mb-4">🎟️</p>
          <h3 className="text-white font-bold text-lg mb-1">Cupones</h3>
          <p className="text-gray-400 text-sm">Crear y gestionar cupones de descuento</p>
        </Link>
      </div>
    </div>
  )
}