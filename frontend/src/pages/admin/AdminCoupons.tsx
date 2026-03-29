import { useEffect, useState } from 'react'
import api from '../../services/api'

interface Coupon {
  id: number
  code: string
  discount: number
  type: string
  isActive: boolean
  expiresAt?: string
  maxUses?: number
  timesUsed: number
}

interface CouponForm {
  code: string
  discount: string
  type: string
  expiresAt: string
  maxUses: string
}

const emptyForm: CouponForm = {
  code: '', discount: '', type: 'percentage', expiresAt: '', maxUses: ''
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [form, setForm] = useState<CouponForm>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchCoupons = async () => {
    api.get('/admin/coupons').then(res => setCoupons(res.data)).catch(console.error)
  }

  useEffect(() => { fetchCoupons() }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.post('/admin/coupons', {
        code: form.code.toUpperCase(),
        discount: parseFloat(form.discount),
        type: form.type,
        isActive: true,
        expiresAt: form.expiresAt || null,
        maxUses: form.maxUses ? parseInt(form.maxUses) : null
      })
      setForm(emptyForm)
      setShowForm(false)
      fetchCoupons()
    } catch {
      alert('Error al crear el cupón')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (id: number, isActive: boolean) => {
    await api.patch(`/admin/coupons/${id}`, { isActive: !isActive })
    fetchCoupons()
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white">Cupones</h1>
        <button
          onClick={() => { setForm(emptyForm); setShowForm(!showForm) }}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition"
        >
          {showForm ? 'Cancelar' : '+ Nuevo cupón'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Código</label>
            <input
              value={form.code}
              onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
              placeholder="ej: DESCUENTO20"
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border border-zinc-700 focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tipo</label>
            <select
              value={form.type}
              onChange={e => setForm({...form, type: e.target.value})}
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border border-zinc-700 focus:outline-none focus:border-red-500"
            >
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed">Monto fijo ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Descuento {form.type === 'percentage' ? '(%)' : '($)'}
            </label>
            <input
              type="number"
              value={form.discount}
              onChange={e => setForm({...form, discount: e.target.value})}
              placeholder={form.type === 'percentage' ? 'ej: 20' : 'ej: 5000'}
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border border-zinc-700 focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Máximo de usos (vacío = ilimitado)</label>
            <input
              type="number"
              value={form.maxUses}
              onChange={e => setForm({...form, maxUses: e.target.value})}
              placeholder="ej: 100"
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border border-zinc-700 focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Vencimiento (vacío = sin vencimiento)</label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={e => setForm({...form, expiresAt: e.target.value})}
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border border-zinc-700 focus:outline-none focus:border-red-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition"
            >
              {loading ? 'Creando...' : 'Crear cupón'}
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-zinc-800">
            <tr>
              <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Código</th>
              <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Descuento</th>
              <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Usos</th>
              <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Vencimiento</th>
              <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Estado</th>
              <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Acción</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} className="border-b border-zinc-800 last:border-0">
                <td className="px-6 py-4 text-white font-bold">{c.code}</td>
                <td className="px-6 py-4 text-white">
                  {c.type === 'percentage' ? `${c.discount}%` : `$${c.discount}`}
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {c.timesUsed}{c.maxUses ? `/${c.maxUses}` : ''}
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('es-AR') : 'Sin vencimiento'}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${c.isActive ? 'bg-green-900 text-green-400' : 'bg-zinc-800 text-gray-500'}`}>
                    {c.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(c.id, c.isActive)}
                    className={`text-sm transition ${c.isActive ? 'text-red-500 hover:text-red-400' : 'text-green-400 hover:text-green-300'}`}
                  >
                    {c.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}