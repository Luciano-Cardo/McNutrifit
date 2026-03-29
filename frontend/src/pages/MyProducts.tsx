import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyProducts, getProductDownload } from '../services/api'
import { useAuthStore } from '../store/authStore'

interface MyProduct {
  productId: number
  name: string
  imageUrl?: string
  category: string
  purchasedAt: string
}

export default function MyProducts() {
  const [products, setProducts] = useState<MyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const fetch = async () => {
      try {
        const res = await getMyProducts()
        setProducts(res.data)
      } catch {
        console.error('Error cargando mis productos')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [isAuthenticated, navigate])

  const handleDownload = async (productId: number) => {
    try {
      const res = await getProductDownload(productId)
      window.open(res.data.fileUrl, '_blank')
    } catch {
      alert('Error al descargar el archivo')
    }
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'long', year: 'numeric'
    })

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-400">Cargando tus planes...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-2">Mis planes</h1>
      <p className="text-gray-400 mb-8">Todos los planes que compraste</p>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl mb-6">Todavía no compraste ningún plan</p>
          <button
            onClick={() => navigate('/productos')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition"
          >
            Ver productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div
              key={product.productId}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
            >
              
              <div className="h-40 bg-zinc-800">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    PDF
                  </div>
                )}
              </div>

              <div className="p-5">
                <span className="text-xs text-red-500 font-bold uppercase tracking-wide">
                  {product.category === 'masa-muscular' ? 'Masa muscular' : 'Perder grasa'}
                </span>
                <h2 className="text-white font-bold text-lg mt-1 mb-1">{product.name}</h2>
                <p className="text-gray-500 text-xs mb-4">
                  Comprado el {formatDate(product.purchasedAt)}
                </p>

                <button
                  onClick={() => handleDownload(product.productId)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Descargar PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}