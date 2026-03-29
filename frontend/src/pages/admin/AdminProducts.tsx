import { useEffect, useState } from 'react'
import api from '../../services/api'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  category: string
  isActive: boolean
}

interface ProductForm {
  name: string
  description: string
  price: string
  originalPrice: string
  category: string
  imageUrl: string
  fileUrl: string
}

const emptyForm: ProductForm = {
  name: '', description: '', price: '', originalPrice: '',
  category: 'masa-muscular', imageUrl: '', fileUrl: ''
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {
    const res = await api.get('/products?includeInactive=true')
    setProducts(res.data)
  }

  useEffect(() => { fetchProducts() }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        isActive: true
      }
      if (editingId) {
        await api.put(`/products/${editingId}`, { ...data, isActive: true })
      } else {
        await api.post('/products', data)
      }
      setForm(emptyForm)
      setEditingId(null)
      setShowForm(false)
      fetchProducts()
    } catch {
      alert('Error al guardar el producto')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: any) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      imageUrl: product.imageUrl || '',
      fileUrl: product.fileUrl || ''
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Desactivar este producto?')) return
    await api.delete(`/products/${id}`)
    fetchProducts()
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white">Productos</h1>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm) }}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition"
        >
          {showForm ? 'Cancelar' : '+ Nuevo producto'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nombre</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border border-zinc-700 focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Categoría</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border border-zinc-700 focus:outline-none focus:border-red-500">
              <option value="masa-muscular">Masa muscular</option>
              <option value="perder-grasa">Perder grasa</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Descripción</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              rows={3} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border border-zinc-700 focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Precio</label>
            <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border border-zinc-700 focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Precio original (tachado)</label>
            <input type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})}
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border border-zinc-700 focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">URL de imagen</label>
            <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})}
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border border-zinc-700 focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">URL del PDF</label>
            <input value={form.fileUrl} onChange={e => setForm({...form, fileUrl: e.target.value})}
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border border-zinc-700 focus:outline-none focus:border-red-500" />
          </div>
          <div className="md:col-span-2">
            <button onClick={handleSubmit} disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition">
              {loading ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-zinc-800">
            <tr>
              <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Producto</th>
              <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Categoría</th>
              <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Precio</th>
              <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Estado</th>
              <th className="text-left px-6 py-4 text-gray-400 text-sm font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-zinc-800 last:border-0">
                <td className="px-6 py-4 text-white">{p.name}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {p.category === 'masa-muscular' ? 'Masa muscular' : 'Perder grasa'}
                </td>
                <td className="px-6 py-4 text-white">{formatPrice(p.price)}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${p.isActive ? 'bg-green-900 text-green-400' : 'bg-zinc-800 text-gray-500'}`}>
                    {p.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <button onClick={() => handleEdit(p)} className="text-blue-400 hover:text-blue-300 text-sm transition">Editar</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-400 text-sm transition">Desactivar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}