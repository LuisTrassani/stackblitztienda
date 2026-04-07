"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from './supabase'; 

export default function Casacón() {
  // --- ESTADOS ---
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState(""); 
  const [tallesSeleccionados, setTallesSeleccionados] = useState({});

  // --- TRAER DATOS DE SUPABASE ---
  useEffect(() => {
    async function cargarDatos() {
      try {
        const { data, error } = await supabase.from('Productos').select('*');
        if (error) throw error;
        if (data) setProductos(data);
      } catch (error) {
        console.error("Error cargando productos:", error.message);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  // --- LÓGICA DE FILTRADO (BUSCADOR) ---
  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- LÓGICA DEL CARRITO ---
  const total = carrito.reduce((acc, p) => acc + p.precio, 0);

  const seleccionarTalle = (productoId, talle) => {
    setTallesSeleccionados({ ...tallesSeleccionados, [productoId]: talle });
  };

  const agregarAlCarrito = (producto) => {
    const talle = tallesSeleccionados[producto.id];
    
    if (!talle) {
      alert("Selecciona un talle primero");
      return;
    }

    // EVITAR DUPLICADOS (Quitar cantidad)
    const existe = carrito.find(item => item.id === producto.id && item.talleSeleccionado === talle);
    if (existe) {
      alert("Ya agregaste esta casaca con este talle");
      return;
    }

    setCarrito([...carrito, { ...producto, talleSeleccionado: talle }]);
  };

  const eliminarDelCarrito = (indiceABorrar) => {
    const nuevoCarrito = carrito.filter((_, index) => index !== indiceABorrar);
    setCarrito(nuevoCarrito);
  };

  const irAlCheckout = () => {
    localStorage.setItem('carrito_casacon', JSON.stringify(carrito));
    localStorage.setItem('total_casacon', total);
    window.open('/checkout', '_blank');
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-black uppercase italic tracking-widest animate-pulse">Buscando Casacas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-0">
      
      <div className="bg-yellow-400 border-b-4 border-black py-3 overflow-hidden whitespace-nowrap relative z-[60]">
        <div className="flex animate-marquee items-center">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="text-xl font-black uppercase italic mx-10">
               🔥 ENVÍOS A TODO EL PAÍS - 3 CUOTAS SIN INTERÉS - CASACÓN OFICIAL 🔥
            </span>
          ))}
        </div>
      </div>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-black">Casacón</h1>
          
          <div className="bg-black text-white px-6 py-2 rounded-2xl flex flex-col items-end shadow-lg cursor-pointer hover:scale-105 transition-transform">
             <span className="text-[10px] font-bold opacity-60 tracking-widest">CARRITO 🛒</span>
             <span className="text-xl font-black">${total.toLocaleString('es-AR')}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="¿Qué casaca buscas hoy?..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-white border-4 border-black p-5 rounded-2xl text-lg font-bold uppercase italic placeholder:text-gray-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all outline-none"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-24">
          {productosFiltrados.map((prod) => (
            <div key={prod.id} className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm flex flex-col hover:shadow-2xl transition-all duration-300 group">
              <div className="aspect-square overflow-hidden rounded-2xl mb-4 bg-gray-50 flex items-center justify-center relative">
                <img 
                  src={prod.imagen || prod.img} 
                  alt={prod.nombre} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-2" 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Casaca+No+Disponible' }}
                />
              </div>

              <div className="px-2 flex flex-col flex-grow">
                <h3 className="text-xs font-bold uppercase tracking-tight text-gray-500 mb-1">{prod.nombre}</h3>
                <p className="text-2xl font-black text-black mb-4">${prod.precio.toLocaleString('es-AR')}</p>
                
                {/* SELECTOR DE TALLES CON TACHADO POR STOCK */}
                <div className="flex gap-1 mb-4">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((talle) => {
                    // Mapeo según tu tabla: S = cepo, el resto stock_talle
                    const columnaStock = talle === 'S' ? 'cepo' : `stock_${talle.toLowerCase()}`;
                    const hayStock = prod[columnaStock] !== null && prod[columnaStock] > 0;

                    return (
                      <button
                        key={talle}
                        disabled={!hayStock}
                        onClick={() => seleccionarTalle(prod.id, talle)}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-lg border-2 transition-all ${
                          !hayStock 
                          ? 'bg-gray-50 border-gray-100 text-gray-300 line-through cursor-not-allowed' 
                          : tallesSeleccionados[prod.id] === talle 
                            ? 'border-black bg-black text-white' 
                            : 'border-gray-100 text-gray-400 hover:border-pink-300'
                        }`}
                      >
                        {talle}
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={() => agregarAlCarrito(prod)}
                  className="w-full mt-auto bg-pink-600 text-white py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-colors active:scale-95 shadow-md"
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        {carrito.length > 0 && (
          <div className="max-w-xl mx-auto mt-20">
            <div className="bg-white rounded-[2.5rem] border-4 border-black p-8 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute -top-4 -right-4 bg-yellow-400 border-4 border-black px-6 py-2 font-black text-sm uppercase italic -rotate-3 shadow-lg">
                ¡Tu Selección!
              </div>
              
              <h2 className="text-3xl font-black uppercase italic mb-8 tracking-tighter">Resumen</h2>
              
              <div className="space-y-3 mb-8 max-h-60 overflow-y-auto pr-2 text-left">
                {carrito.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
                            <img src={item.imagen || item.img} className="w-full h-full object-contain" alt="" />
                        </div>
                        <div>
                            <p className="font-bold text-xs uppercase">{item.nombre} ({item.talleSeleccionado})</p>
                            <p className="text-[10px] font-black text-pink-600">${item.precio.toLocaleString('es-AR')}</p>
                        </div>
                    </div>
                    <button 
                      onClick={() => eliminarDelCarrito(index)}
                      className="bg-red-100 text-red-500 w-8 h-8 rounded-full font-black hover:bg-red-500 hover:text-white transition-all text-xs"
                    >✕</button>
                  </div>
                ))}
              </div>

              <div className="border-t-4 border-black pt-6 flex justify-between items-center mb-8">
                <div className="flex flex-col text-left">
                    <span className="font-bold text-gray-400 text-xs uppercase tracking-widest">Total</span>
                    <span className="text-4xl font-black text-black italic leading-none">${total.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <button 
                onClick={irAlCheckout}
                className="w-full bg-green-500 border-4 border-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xl hover:bg-green-600 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Finalizar Compra 🚀
              </button>
            </div>
          </div>
        )}
      </main>

      <section className="bg-black text-white py-20 px-4 mt-20 border-t-8 border-yellow-400">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16 text-left">
          <div>
            <h4 className="font-black italic text-3xl mb-6 uppercase tracking-tighter">Viví la experiencia MisteryBox</h4>
            <p className="opacity-60 font-bold mb-2">Ventas por Mayor y Menor</p>
            <p className="font-black text-lg">Somos Juanchi y Luis 3731652931</p>
            <p className="opacity-60 mt-4 italic text-sm">Horarios: Lun a Sáb 09:00 a 20:00hs</p>
          </div>
          <div>
            <h4 className="font-black italic text-3xl mb-6 uppercase tracking-tighter">Ayuda</h4>
            <ul className="space-y-3 font-bold uppercase text-sm tracking-widest">
              <li className="hover:text-pink-500 cursor-pointer transition-colors">Envíos y Entregas</li>
              <li className="hover:text-pink-500 cursor-pointer transition-colors">Tabla de Talles</li>
              <li className="hover:text-pink-500 cursor-pointer transition-colors">Cambios de Casaca</li>
              <li className="hover:text-pink-500 cursor-pointer transition-colors">Términos Oficiales</li>
            </ul>
          </div>
          <div>
          <h4 className="font-black italic text-3xl mb-6 uppercase tracking-tighter">Redes</h4>
<div className="flex gap-6">
  {/* Instagram */}
  <button className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all transform hover:-rotate-12 group">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  </button>

  {/* Facebook */}
  <button className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:rotate-12">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
    >
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.03 1.764-5.908 5.43-5.908 1.489 0 2.242.1 2.614.157v3.288h-1.969c-1.317 0-1.764.717-1.764 2.129v1.914h3.73l-.534 3.667h-3.196v7.981h-3.841z"/>
    </svg>
  </button>

  {/* WhatsApp */}
  <button className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-all transform hover:-rotate-12">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  </button>
</div>
          </div>
        </div>
      </section>

      <footer className="bg-black text-center py-10 border-t border-gray-800">
        <p className="opacity-40 text-[10px] font-black uppercase tracking-[0.3em] text-white">
            Casacón © 2026 - Hecho por Luis Trassani🚀
        </p>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}