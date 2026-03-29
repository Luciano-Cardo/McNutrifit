import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
 
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { getItemCount } = useCartStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
 
  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }
 
  return (
    <nav className="bg-black border-b border-zinc-900 sticky top-0 z-50" style={{minHeight: '80px', paddingTop: '16px'}}>
 
      {/* Fila 1: logo centrado + iconos a la derecha */}
      <div className="relative flex items-center justify-center px-6 pt-10 pb-6">
 
        {/* Logo centrado */}
        <Link to="/" className="flex items-center">
          <svg width="48" height="36" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 32L16 8L24 22L32 8L44 32" stroke="#c0392b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
 
        {/* Iconos derecha — absolutos */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-5">
 
          {/* Usuario */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className="text-gray-400 hover:text-white transition">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-10 bg-zinc-900 border border-zinc-700 rounded-xl py-3 w-56 hidden group-hover:block shadow-2xl">
                <span className="block px-5 py-3 text-sm font-bold text-white border-b border-zinc-700">{user?.name}</span>
                {user?.role === 'admin' && (
                <Link to="/admin" className="block px-5 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 transition font-bold">
                  Panel admin
                </Link>
                )}
                <Link to="/mis-productos" className="block px-5 py-3 text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition">Mis planes</Link>
                <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-sm text-red-500 hover:text-red-400 hover:bg-zinc-800 transition">Salir</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-gray-400 hover:text-white transition">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}
 
          {/* Carrito */}
          <Link to="/carrito" className="relative text-gray-400 hover:text-white transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {getItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                {getItemCount()}
              </span>
            )}
          </Link>
 
        </div>
      </div>
 
      {/* Fila 2: links centrados — desktop */}
      <div className="hidden md:flex items-center justify-center gap-10 pb-8 px-6">
        <Link to="/" className="text-xs font-semibold text-gray-400 hover:text-white transition uppercase tracking-widest">
          Inicio
        </Link>
        <Link to="/productos" className="text-xs font-semibold text-gray-400 hover:text-white transition uppercase tracking-widest">
          Productos
        </Link>
      </div>
 
      {/* Mobile: logo + iconos + hamburguesa */}
      <div className="md:hidden flex items-center justify-between px-6 py-3">
        <Link to="/">
          <svg width="36" height="28" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 32L16 8L24 22L32 8L44 32" stroke="#c0392b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <div className="flex items-center gap-4">
          <Link to={isAuthenticated ? '/mis-productos' : '/login'} className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
          <Link to="/carrito" className="relative text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
 
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-5 border-t border-zinc-900 px-6 py-6 bg-black">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-xs font-semibold text-gray-400 hover:text-white transition uppercase tracking-widest">Inicio</Link>
          <Link to="/productos" onClick={() => setMenuOpen(false)} className="text-xs font-semibold text-gray-400 hover:text-white transition uppercase tracking-widest">Productos</Link>
          {isAuthenticated ? (
            <>
              <Link to="/mis-productos" onClick={() => setMenuOpen(false)} className="text-xs font-semibold text-gray-400 hover:text-white transition uppercase tracking-widest">Mis planes</Link>
              <span className="text-zinc-600 text-xs">{user?.name}</span>
              <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-400 transition uppercase tracking-widest">Salir</button>
            </>
          ) : (
            <Link to="/register" onClick={() => setMenuOpen(false)} className="text-xs font-bold text-red-500 hover:text-red-400 transition uppercase tracking-widest">Registrarse</Link>
          )}
        </div>
      )}
    </nav>
  )
}