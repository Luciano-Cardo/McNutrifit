import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../services/api'
import { useCartStore } from '../store/cartStore'

interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  imageUrl?: string
  category: string
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const { addItem } = useCartStore()

  useEffect(() => {
    getProductById(Number(id))
      .then(res => setProduct(res.data))
      .catch(() => navigate('/productos'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)

  const discount = (original: number, current: number) =>
    Math.round((1 - current / original) * 100)

  const handleAddToCart = () => {
    if (!product) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 min-h-screen">

      <button
        onClick={() => navigate('/productos')}
        className="text-gray-400 hover:text-white text-sm mb-8 flex items-center gap-2 transition"
      >
        ← Volver a productos
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        <div className="bg-zinc-900 rounded-2xl overflow-hidden h-80 md:h-auto border border-zinc-800">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              Sin imagen
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">

          <span className="text-red-500 text-sm font-bold uppercase tracking-wide mb-2">
            {product.category === 'masa-muscular' ? 'Masa muscular' : 'Perder grasa'}
          </span>

          <h1 className="text-3xl font-black text-white mb-4">
            {product.name}
          </h1>

          <p className="text-gray-400 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-black text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-gray-500 line-through text-xl">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-lg">
                  -{discount(product.originalPrice, product.price)}% OFF
                </span>
              </>
            )}
          </div>

          <ul className="space-y-2 mb-8">
            {['Descarga inmediata al pagar', 'Accedé desde cualquier dispositivo', 'PDF de alta calidad'].map(b => (
              <li key={b} className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="text-red-500 font-bold">✓</span>
                {b}
              </li>
            ))}
          </ul>

          <button
            onClick={handleAddToCart}
            className={`w-full font-bold py-4 rounded-lg text-lg transition ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {added ? '¡Agregado al carrito!' : 'Agregar al carrito'}
          </button>

        </div>
      </div>
    </div>
  )
}