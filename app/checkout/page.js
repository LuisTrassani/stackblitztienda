"use client";

import React, { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [datos, setDatos] = useState({
    nombre: '',
    direccion: '',
    localidad: '',
    metodoPago: 'Transferencia'
  });

  // CARGAR DATOS DESDE LOCALSTORAGE AL INICIAR
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito_casacon');
    const totalGuardado = localStorage.getItem('total_casacon');

    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
    if (totalGuardado) {
      setTotal(totalGuardado);
    }
  }, []);

  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const finalizarPedidoWhatsApp = () => {
    if (!datos.nombre || !datos.direccion) {
      alert("Por favor, completa tu nombre y dirección");
      return;
    }

    const listaProductos = carrito.map(p => `- ${p.nombre} (Talle: ${p.talleSeleccionado})`).join('\n');
    
    const mensaje = `¡Hola Casacón! 🏆\n\n` +
      `*NUEVO PEDIDO OFICIAL*\n` +
      `--------------------------\n` +
      `👤 *Cliente:* ${datos.nombre}\n` +
      `📍 *Dirección:* ${datos.direccion}, ${datos.localidad}\n` +
      `💳 *Pago:* ${datos.metodoPago}\n` +
      `--------------------------\n` +
      `*PRODUCTOS:*\n${listaProductos}\n\n` +
      `*TOTAL: $${Number(total).toLocaleString('es-AR')}*\n\n` +
      `Espero confirmación para coordinar el envío. ¡Gracias!`;

    const url = `https://wa.me/543731652931?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  if (carrito.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h2 className="text-4xl font-black uppercase italic mb-6">El carrito está vacío</h2>
        <a href="/" className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase italic">Volver a la tienda</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER MINI */}
        <div className="flex justify-between items-center mb-12 border-b-4 border-black pb-6">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">Checkout</h1>
            <div className="bg-yellow-400 border-4 border-black px-4 py-1 font-black italic -rotate-2 shadow-md">
                PASO FINAL
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="space-y-6">
            <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-3xl">
              <h3 className="text-2xl font-black uppercase italic mb-6">Datos de Envío</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2">Nombre Completo</label>
                  <input 
                    name="nombre" onChange={manejarCambio}
                    type="text" placeholder="Ej: Juan Perez"
                    className="w-full border-2 border-black p-3 rounded-xl font-bold outline-none focus:bg-pink-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2">Dirección de Entrega</label>
                  <input 
                    name="direccion" onChange={manejarCambio}
                    type="text" placeholder="Calle y número"
                    className="w-full border-2 border-black p-3 rounded-xl font-bold outline-none focus:bg-pink-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2">Localidad / Ciudad</label>
                  <input 
                    name="localidad" onChange={manejarCambio}
                    type="text" placeholder="Ej: Resistencia, Chaco"
                    className="w-full border-2 border-black p-3 rounded-xl font-bold outline-none focus:bg-pink-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2">Método de Pago</label>
                  <select 
                    name="metodoPago" onChange={manejarCambio}
                    className="w-full border-2 border-black p-3 rounded-xl font-bold outline-none bg-white"
                  >
                    <option value="Transferencia">Transferencia (10% OFF)</option>
                    <option value="Efectivo">Efectivo al recibir</option>
                    <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: RESUMEN Y BOTÓN */}
          <div className="flex flex-col gap-6">
            <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(236,72,153,1)]">
              <h3 className="text-2xl font-black uppercase italic mb-6">Tu Pedido</h3>
              
              <div className="space-y-4 mb-8 border-b border-white/20 pb-6">
                {carrito.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm font-bold uppercase italic opacity-80">{item.nombre} ({item.talleSeleccionado})</span>
                    <span className="font-black">${item.precio.toLocaleString('es-AR')}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-black uppercase italic">Total:</span>
                <span className="text-4xl font-black text-yellow-400">${Number(total).toLocaleString('es-AR')}</span>
              </div>

              <button 
                onClick={finalizarPedidoWhatsApp}
                className="w-full bg-green-500 border-4 border-white text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xl hover:bg-green-600 hover:scale-[1.02] transition-all shadow-lg"
              >
                Confirmar Pedido ✅
              </button>
              <p className="text-[10px] text-center mt-4 opacity-50 uppercase font-bold">Serás redirigido a WhatsApp para finalizar</p>
            </div>

            <button 
                onClick={() => window.close()}
                className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 hover:opacity-100 transition-opacity"
            >
                ← Seguir Comprando
            </button>
          </div>

        </div>

        <footer className="mt-20 text-center py-10 opacity-20">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Desarrollado por Luis Trassani</p>
        </footer>

      </div>
    </div>
  );
}