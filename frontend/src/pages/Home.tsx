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
 
export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const { addItem } = useCartStore()
  const navigate = useNavigate()
 
  useEffect(() => {
    getProducts().then(res => setProducts(res.data)).catch(console.error)
  }, [])
 
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)
 
  const discount = (original: number, current: number) =>
    Math.round((1 - current / original) * 100)
 
  const categoryLabel = (cat: string) => {
    if (cat === 'masa-muscular') return 'Masa muscular'
    if (cat === 'perder-grasa') return 'Perder grasa'
    return cat
  }
 
  return (
    <div className="bg-black w-full">
      <section
        className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{ background: 'linear-gradient(160deg, #1a0000 0%, #000000 50%, #0d0d0d 100%)' }}>
        <span className="inline-block text-xs font-black text-red-500 uppercase tracking-widest mb-8 border border-red-800 px-3 py-2 rounded-full text-center">
          Guias digitales · Descarga instantánea
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-8xl font-black text-white leading-none tracking-tight mb-6 uppercase text-center">
          Transformá tu<br />cuerpo con el<br />plan <span className="text-red-500">correcto</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed text-center">
          Rutinas de entrenamiento, dietas completas y guias diseñados por profesionales. Descargalos al instante.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={() => navigate('/productos')} className="bg-red-600 hover:bg-red-700 text-white font-black px-12 py-4 rounded-lg text-base transition uppercase tracking-widest">
            Ver guias
          </button>
          <button onClick={() => navigate('/register')} className="border border-zinc-600 hover:border-white text-white font-bold px-12 py-4 rounded-lg text-base transition uppercase tracking-widest">
            Crear cuenta gratis
          </button>
        </div>
        <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
          <svg className="w-4 h-4 text-gray-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>
      <section className="flex justify-center" style={{paddingTop: '16px', paddingBottom: '16px'}}>
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          {[
            { icon: '⚡', title: 'Llega al instante', desc: 'Descargá apenas completés el pago' },
            { icon: '📱', title: 'Lo abrís desde el celu', desc: 'Compatible con cualquier dispositivo' },
            { icon: '🎯', title: 'Guias profesionales', desc: 'Diseñados por nutricionistas y entrenadores' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex items-center justify-center gap-5 px-10 py-8">
              <span className="text-4xl">{icon}</span>
              <div>
                <h3 className="text-white font-black text-base uppercase tracking-wide">{title}</h3>
                <p className="text-gray-500 text-sm mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="flex justify-center" style={{paddingTop: '16px', paddingBottom: '16px'}}>
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
            {[
              { label: 'Ganar masa\nmuscular', style: 'linear-gradient(135deg, #3d0000 0%, #1a0000 100%)', icon: '💪' },
              { label: 'Perder\ngrasa', style: 'linear-gradient(135deg, #001a3d 0%, #000d1a 100%)', icon: '🔥' },
            ].map(({ label, style, icon }) => (
              <div
                key={label}
                onClick={() => navigate('/productos')}
                className="relative h-48 rounded-2xl overflow-hidden cursor-pointer group border border-zinc-800 hover:border-red-600 transition"
                style={{ background: style }}>
                <div className="absolute inset-0 flex flex-col justify-center px-10">
                  <span className="text-xs text-red-400 font-black uppercase tracking-widest mb-2" style={{paddingLeft: '10px'}}>Objetivo</span>
                  <h3 className="text-white font-black text-3xl uppercase tracking-tight whitespace-pre-line" style={{paddingLeft: '10px'}}>{label}</h3>
                </div>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-7xl opacity-10 group-hover:opacity-20 transition">{icon}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="flex justify-center " style={{paddingTop: '16px', paddingBottom: '16px'}}>
        <div className="w-full max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">Resultados reales</h2>
            <p className="text-gray-500 mt-2">Nuestros clientes hablan por nosotros</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{paddingTop: '16px', paddingBottom: '16px'}}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-zinc-800">
                <div className="w-full h-80 relative">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 bg-zinc-800 flex items-center justify-center">
                      <span className="text-white font-black text-2xl uppercase tracking-widest opacity-60">Antes</span>
                    </div>
                    <div className="w-1/2 bg-zinc-700 flex items-center justify-center">
                      <span className="text-red-500 font-black text-2xl uppercase tracking-widest opacity-60">Después</span>
                    </div>
                  </div>
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-red-600 z-10" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap z-10">
                    12 semanas
                  </div>
                </div>
                <div className="bg-black px-5 py-4 flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-400 text-xs">5.0</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-white font-black text-xl">⭐ Más de <span className="text-red-500">500 clientes</span> satisfechos</p>
          </div>
        </div>
      </section>
      <section className="flex justify-center text-center" style={{ background: 'linear-gradient(160deg, #0d0000 0%, #000000 100%)' }}>
        <div className="w-full max-w-2xl mx-auto" style={{paddingTop: '16px', paddingBottom: '16px'}}>
          <h2 className="text-5xl font-black text-white tracking-tight uppercase mb-4 text-center">¿Listo para<br />empezar?</h2>
          <p className="text-gray-500 mb-10 leading-relaxed text-center">Creá tu cuenta gratis y accedé a todos tus guias desde cualquier dispositivo</p>
          <button onClick={() => navigate('/register')} className="bg-red-600 hover:bg-red-700 text-white font-black px-14 py-4 rounded-lg text-base transition uppercase tracking-widest">
            Empezar ahora
          </button>
        </div>
      </section>
    </div>
  )
}