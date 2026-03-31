import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../services/api'
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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await getProducts(category || undefined)
        setProducts(res.data)
      } catch {
        console.error('Error cargando productos')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [category])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)

  const discount = (original: number, current: number) =>
    Math.round((1 - current / original) * 100)

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 min-h-screen" style={{paddingTop: '16px', paddingBottom: '16px'}}>
      <h1 className="text-3xl font-bold text-white mb-2 text-center">Nuestros guias</h1>
      <p className="text-gray-400 mb-8 text-center">Descargá tu plan al instante después de comprar</p>
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setCategory('')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
          category === '' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}>
          Todos
        </button>
        <button
          onClick={() => setCategory('masa-muscular')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
          category === 'masa-muscular' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}>
          Ganar masa muscular
        </button>
        <button
          onClick={() => setCategory('perder-grasa')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
          category === 'perder-grasa' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}>
          Perder grasa
        </button>
      </div>
      {loading ? (
        <div className="text-gray-400 text-center py-20">Cargando productos...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{paddingTop: '16px', paddingBottom: '16px'}}>
          {products.map(product => (
            <div
              key={product.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-600 transition">
              <div
                className="h-48 bg-zinc-800 cursor-pointer"
                onClick={() => navigate(`/productos/${product.id}`)}>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="p-5">
                <span className="text-xs text-red-500 font-bold uppercase tracking-wide" style={{paddingLeft:'10px'}}>
                  {product.category === 'masa-muscular' ? 'Masa muscular' : 'Perder grasa'}
                </span>
                <h2
                  className="text-white font-bold text-lg mt-1 mb-2 cursor-pointer hover:text-red-400 transition" style={{paddingLeft:'10px'}}
                  onClick={() => navigate(`/productos/${product.id}`)}>
                  {product.name}
                </h2>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2" style={{paddingLeft:'10px'}}>
                  {product.description}
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-white font-bold text-xl" style={{paddingLeft:'10px'}}>
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-gray-500 line-through text-sm">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        -{discount(product.originalPrice, product.price)}%
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => addItem(product)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}