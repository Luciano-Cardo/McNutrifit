import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PagoExitoso() {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => navigate('/mis-productos'), 4000)
  }, [navigate])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-black text-white mb-4">¡Pago exitoso!</h1>
        <p className="text-gray-400 text-lg mb-2">Tu compra fue procesada correctamente.</p>
        <p className="text-gray-500 text-sm">Te redirigimos a tus planes en unos segundos...</p>
      </div>
    </div>
  )
}