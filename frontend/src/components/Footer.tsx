import { Link } from 'react-router-dom'
 
export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800" style={{paddingLeft: '24px', paddingRight: '24px'}}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-5">Navegación</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm transition">Inicio</Link></li>
              <li><Link to="/productos" className="text-gray-400 hover:text-white text-sm transition">Productos</Link></li>
              <li><Link to="/carrito" className="text-gray-400 hover:text-white text-sm transition">Carrito</Link></li>
              <li><Link to="/mis-productos" className="text-gray-400 hover:text-white text-sm transition">Mis guias</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white text-sm transition">Iniciar sesión</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white text-sm transition">Registrarse</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-5">Guias</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/productos" className="text-gray-400 hover:text-white text-sm transition">Masa muscular</Link></li>
              <li><Link to="/productos" className="text-gray-400 hover:text-white text-sm transition">Perder grasa</Link></li>
              <li><Link to="/productos" className="text-gray-400 hover:text-white text-sm transition">Plan alimentario</Link></li>
              <li><Link to="/productos" className="text-gray-400 hover:text-white text-sm transition">Rutina de entrenamiento</Link></li>
              <li><Link to="/productos" className="text-gray-400 hover:text-white text-sm transition">Intermedio</Link></li>
              <li><Link to="/productos" className="text-gray-400 hover:text-white text-sm transition">Avanzado</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-5">Asistencia</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="https://wa.me/5492216403577" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white text-sm transition">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:mcnutrifitv@gmail.com" className="text-gray-400 hover:text-white text-sm transition">
                  Contacto por email
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-5">Seguinos</h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a href="https://www.instagram.com/mc.nutrifit/" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-800 py-5 px-10">
        <p className="text-gray-600 text-xs text-center mt-3">
          © {new Date().getFullYear()} MCNutriFit. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}