import { useNavigate } from 'react-router-dom'

export default function PagoPendiente() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="text-3xl font-black text-white mb-4">Pago pendiente</h1>
        <p className="text-gray-400 text-lg mb-6">Tu pago está siendo procesado. Te avisaremos cuando se confirme.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}