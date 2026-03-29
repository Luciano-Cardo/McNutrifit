import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { login: setAuth } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(email, password)
      setAuth(res.data.token, {
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      })
      navigate('/')
    } catch {
      setError('Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full" style={{ maxWidth: '580px', paddingBottom: '300px' }}>

        <div className="text-center mb-10">
          <h1 className="font-bold text-white" style={{ fontSize: '52px' }}>
            MC<span className="text-red-500">Nutrifit</span>
          </h1>
          <p className="text-gray-400 mt-3 text-xl">Iniciá sesión en tu cuenta</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800" style={{ padding: '48px' }}>
          <form onSubmit={handleSubmit} className="space-y-6">

            <div style={{ padding: '10px'}}>
              <label className="block text-gray-400 mb-2" style={{ fontSize: '18px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:border-red-500 transition"
                style={{ padding: '16px 20px', fontSize: '18px' }}
                placeholder="tu@email.com"
              />
            </div>

            <div style={{ padding: '10px'}}>
              <label className="block text-gray-400 mb-2" >Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:border-red-500 transition"
                style={{ padding: '16px 20px', fontSize: '18px' }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-500" style={{ fontSize: '16px' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg transition"
              style={{ padding: '18px', fontSize: '20px' }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

          </form>

          <p className="text-center text-gray-400 mt-8" style={{ fontSize: '16px', paddingTop: '10px' }}>
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="text-red-500 hover:underline">
              Registrate
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}