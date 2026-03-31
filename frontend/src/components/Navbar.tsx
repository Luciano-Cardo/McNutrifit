import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { getItemCount } = useCartStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
    setDropdownOpen(false)
  }

  const Logo = () => (
    <img src="/logo.png" alt="MCNutriFit" className="h-15" style={{paddingLeft:'10px'}}/>
  )

  const UserIcon = () => (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )

  const CartIcon = () => (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )

  return (
    <nav className="bg-black border-b border-zinc-900 sticky top-0 z-50">
      <div className="hidden md:block">
        <div className="flex items-center justify-between px-6 py-5">
          <Link to="/"><Logo /></Link>
          <div className="flex items-center gap-10">
            <Link to="/" className="text-xs font-semibold text-gray-400 hover:text-white transition uppercase tracking-widest">Inicio</Link>
            <Link to="/productos" className="text-xs font-semibold text-gray-400 hover:text-white transition uppercase tracking-widest">Productos</Link>
          </div>
          <div className="flex items-center gap-5" style={{paddingRight: '20px'}}>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-gray-400 hover:text-white transition">
                  <UserIcon />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-10 bg-zinc-900 border border-zinc-700 rounded-xl py-3 w-56 shadow-2xl">
                    <span className="block px-5 py-3 text-sm font-bold text-white border-b border-zinc-700">{user?.name}</span>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-5 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 transition font-bold">
                        Panel admin
                      </Link>
                    )}
                    <Link
                      to="/mis-productos"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-5 py-3 text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition">
                      Mis guias
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3 text-sm text-red-500 hover:text-red-400 hover:bg-zinc-800 transition">
                      Salir
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-400 hover:text-white transition"><UserIcon /></Link>
            )}
            <Link to="/carrito" className="relative text-gray-400 hover:text-white transition">
              <CartIcon />
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                  {getItemCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/"><Logo /></Link>
          <div className="flex items-center gap-4">
            <Link to={isAuthenticated ? '/mis-productos' : '/login'} className="text-gray-400 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <Link to="/carrito" className="relative text-gray-400 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {getItemCount()}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="flex flex-col items-center gap-5 border-t border-zinc-900 px-6 py-6 bg-black">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-xs font-semibold text-gray-400 hover:text-white transition uppercase tracking-widest">Inicio</Link>
            <Link to="/productos" onClick={() => setMenuOpen(false)} className="text-xs font-semibold text-gray-400 hover:text-white transition uppercase tracking-widest">Productos</Link>
            {isAuthenticated ? (
              <>
                <Link to="/mis-productos" onClick={() => setMenuOpen(false)} className="text-xs font-semibold text-gray-400 hover:text-white transition uppercase tracking-widest">Mis guias</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-xs font-bold text-red-400 hover:text-red-300 transition uppercase tracking-widest">Panel admin</Link>
                )}
                <span className="text-zinc-600 text-xs">{user?.name}</span>
                <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-400 transition uppercase tracking-widest">Salir</button>
              </>
            ) : (
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-xs font-bold text-red-500 hover:text-red-400 transition uppercase tracking-widest">Registrarse</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}