'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen_url: string;
  imagen_url_2?: string;
  imagen_url_3?: string;
  gen_url_4?: string;
  imagen?: string;
  img?: string;
  cepo?: number;
  stock_s?: number;
  stock_m?: number;
  stock_l?: number;
  stock_xl?: number;
  stock_xxl?: number;
  stock_xxxl?: number;
}

export default function Casacon() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<any[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState<string>('');
  const [orden, setOrden] = useState<string>('default');
  const [tallesSeleccionados, setTallesSeleccionados] = useState<
    Record<number, string>
  >({});
  const [imagenSeleccionada, setImagenSeleccionada] = useState<
    Record<number, string>
  >({});
  const [verTalles, setVerTalles] = useState(false);
  const [verCuidados, setVerCuidados] = useState(false);
  const [productoZoom, setProductoZoom] = useState<Producto | null>(null);
  const obtenerImagenPrincipal = (prod: Producto) => {
    // 1. Prioridad: Lo que el usuario clickeó en las miniaturas
    // 2. Fallbacks: Probar todos los nombres de columna posibles
    return (
      imagenSeleccionada[prod.id] ||
      prod.imagen_url ||
      prod.imagen ||
      prod.img ||
      ''
    );
  };

  useEffect(() => {
    async function cargarDatos() {
      try {
        const { data, error } = await supabase.from('Productos').select('*');
        if (error) throw error;
        if (data) setProductos(data);
      } catch (err: any) {
        console.error('Error:', err.message);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  const productosFiltrados = productos
    .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      if (orden === 'precio-menor') return a.precio - b.precio;
      if (orden === 'precio-mayor') return b.precio - a.precio;
      if (orden === 'nombre') return a.nombre.localeCompare(b.nombre);
      return 0;
    });

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const cambiarCantidad = (id: number, talle: string, delta: number) => {
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.id === id && item.talleSeleccionado === talle) {
          const nuevaCant = item.cantidad + delta;
          return { ...item, cantidad: nuevaCant < 1 ? 1 : nuevaCant };
        }
        return item;
      })
    );
  };

  const seleccionarTalle = (productoId: number, talle: string) => {
    setTallesSeleccionados({ ...tallesSeleccionados, [productoId]: talle });
  };

  const agregarAlCarrito = (producto: Producto) => {
    const talle = tallesSeleccionados[producto.id];
    if (!talle) {
      alert('Selecciona un talle primero');
      return;
    }
    const existeIndice = carrito.findIndex(
      (item) => item.id === producto.id && item.talleSeleccionado === talle
    );
    if (existeIndice !== -1) {
      const nuevo = [...carrito];
      nuevo[existeIndice].cantidad += 1;
      setCarrito(nuevo);
    } else {
      setCarrito([
        ...carrito,
        { ...producto, talleSeleccionado: talle, cantidad: 1 },
      ]);
    }
  };

  const eliminarDelCarrito = (indice: number) => {
    setCarrito(carrito.filter((_, i) => i !== indice));
  };

  const irAlCheckout = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    localStorage.setItem('carrito_casacon', JSON.stringify(carrito));
    localStorage.setItem('total_casacon', total.toString());
    window.location.href = '/checkout';
  };

  if (cargando)
    return (
      <div className="min-h-screen flex items-center justify-center font-black uppercase italic">
        Buscando Casacas...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans">
      {/* Banner Marquee */}
      <div className="bg-yellow-400 border-b-4 border-black py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="text-xl font-black uppercase italic mx-10">
              🔥 ENVÍOS A TODO EL PAÍS - VENTAS POR MAYOR Y MENOR - CASACÓN
              OFICIAL 🔥
            </span>
          ))}
        </div>
      </div>

      <header className="bg-white border-b-4 border-black sticky top-0 z-50 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center h-20 md:h-24">
          {/* LOGO */}
          <div className="h-full flex items-center py-2">
            <img
              src="https://lstaiadjehagsvyjhgvf.supabase.co/storage/v1/object/sign/CASACON/casaconLOGO1.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xODliMTNiYy1kMGU3LTQ4NmUtYmNmNi02NWIyMWFhMzE0ZmEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDQVNBQ09OL2Nhc2Fjb25MT0dPMS5wbmciLCJpYXQiOjE3NzU2MjU5NzQsImV4cCI6MTgwNzE2MTk3NH0.dQaw-v8Kt04NxykwRgouQ7qLk0Fm-1TsBQ_1GpUVQsU"
              alt="Casacón"
              className="h-full w-auto object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* CARRITO REDISEÑADO - AHORA RESALTA SÍ O SÍ */}
          <div onClick={irAlCheckout} className="group relative cursor-pointer">
            {/* Sombra decorativa trasera (hace que parezca 3D) */}
            <div className="absolute inset-0 bg-pink-600 rounded-2xl translate-x-1 translate-y-1 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform"></div>

            {/* Botón Principal */}
            <div className="relative bg-yellow-400 border-4 border-black px-4 py-2 md:px-6 md:py-3 rounded-2xl flex items-center gap-3 group-active:translate-x-0.5 group-active:translate-y-0.5 transition-all">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase leading-none text-black/60 mb-1">
                  Total Carrito
                </span>
                <span className="text-lg md:text-2xl font-black leading-none text-black">
                  ${total.toLocaleString('es-AR')}
                </span>
              </div>

              {/* Icono con burbuja de cantidad si hay productos */}
              <div className="relative bg-black text-white p-2 rounded-xl">
                <span className="text-xl md:text-2xl">🛒</span>
                {carrito.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-600 border-2 border-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                    {carrito.reduce((acc, p) => acc + p.cantidad, 0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Buscador y Filtros */}
        <div className="mb-12 max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="🔍¿Qué camiseta buscas hoy?..."
            className="flex-grow border-4 border-black p-5 rounded-2xl font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] outline-none"
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select
            onChange={(e) => setOrden(e.target.value)}
            className="bg-yellow-400 border-4 border-black p-4 rounded-2xl font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] outline-none cursor-pointer"
          >
            <option value="default">Ordenar</option>
            <option value="precio-menor">Menor Precio</option>
            <option value="precio-mayor">Mayor Precio</option>
            <option value="nombre">A - Z</option>
          </select>
        </div>

        {/* Grilla de Productos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {productosFiltrados.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm flex flex-col group"
            >
              <div
                onClick={() => setProductoZoom(prod)} // Al hacer click, guardamos el producto aquí
                className="aspect-square bg-gray-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden cursor-zoom-in"
              >
                <img
                  src={
                    imagenSeleccionada[prod.id] ||
                    prod.imagen_url ||
                    prod.imagen ||
                    prod.img
                  }
                  className="w-full h-full object-contain group-hover:scale-110 transition-all p-2"
                />
              </div>

              {/* Mini Galería */}
              <div className="flex gap-1 justify-center mb-4">
                {[
                  prod.imagen_url || prod.imagen || prod.img,
                  prod.imagen_url_2,
                  prod.imagen_url_3,
                ]
                  .filter(Boolean)
                  .map((img, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setImagenSeleccionada({
                          ...imagenSeleccionada,
                          [prod.id]: img!,
                        })
                      }
                      className="w-8 h-8 border rounded overflow-hidden bg-white"
                    >
                      <img src={img} className="w-full h-full object-contain" />
                    </button>
                  ))}
              </div>

              <h3 className="text-xs font-bold uppercase text-gray-500 mb-1">
                {prod.nombre}
              </h3>
              <p className="text-2xl font-black mb-4">
                ${prod.precio.toLocaleString('es-AR')}
              </p>

              <div className="flex gap-1 mb-4">
                {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((t) => {
                  // Verificamos si hay stock para ese talle específico en el objeto 'prod'
                  const stockClave =
                    `stock_${t.toLowerCase()}` as keyof Producto;
                  const tieneStock = (prod[stockClave] as number) > 0;

                  return (
                    <button
                      key={t}
                      disabled={!tieneStock} // Si no hay stock, el botón no se puede clickear
                      onClick={() => seleccionarTalle(prod.id, t)}
                      className={`flex-1 text-[10px] font-bold py-1 rounded-lg border-2 transition-all
          ${
            !tieneStock
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50' // Estilo Sin Stock
              : tallesSeleccionados[prod.id] === t
              ? 'bg-black text-white border-black' // Estilo Seleccionado
              : 'border-gray-100 hover:border-black' // Estilo Disponible
          }`}
                    >
                      {t}
                      {!tieneStock && (
                        <span className="block text-[8px]"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => agregarAlCarrito(prod)}
                // Si no hay ningún talle con stock, podrías deshabilitar todo el producto
                className="w-full bg-pink-600 text-white font-black py-3 rounded-2xl uppercase text-[10px] hover:bg-black transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {tallesSeleccionados[prod.id]
                  ? 'Agregar al carrito'
                  : 'Selecciona talle'}
              </button>
            </div>
          ))}
        </div>

        {/* Resumen Flotante / Final */}
        {carrito.length > 0 && (
          <div className="max-w-xl mx-auto mt-20">
            <div className="bg-white rounded-[2.5rem] border-4 border-black p-8 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] relative">
              {/* EL CARTELITO DE "TU SELECCIÓN" */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 border-4 border-black px-6 py-2 font-black text-sm uppercase italic -rotate-3 shadow-lg z-10">
                ¡Tu Selección!
              </div>

              <h2 className="text-3xl font-black uppercase italic mb-8 tracking-tighter">
                Resumen
              </h2>

              <div className="space-y-3 mb-8 max-h-60 overflow-y-auto pr-2 text-left">
                {carrito.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
                        <img
                          src={item.imagen_url || item.imagen || item.img}
                          className="w-full h-full object-contain"
                          alt=""
                        />
                      </div>
                      <div>
                        <p className="font-bold text-xs uppercase leading-tight">
                          {item.nombre} ({item.talleSeleccionado})
                        </p>
                        <p className="text-[10px] font-black text-pink-600">
                          $
                          {(item.precio * item.cantidad).toLocaleString(
                            'es-AR'
                          )}
                        </p>
                      </div>
                    </div>

                    {/* CONTROL DE CANTIDAD */}
                    <div className="flex items-center gap-2 bg-white border-2 border-black rounded-lg px-2 py-1">
                      <button
                        onClick={() =>
                          cambiarCantidad(item.id, item.talleSeleccionado, -1)
                        }
                        className="font-black text-xs px-1 hover:text-pink-600"
                      >
                        -
                      </button>
                      <span className="font-black text-xs w-4 text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() =>
                          cambiarCantidad(item.id, item.talleSeleccionado, 1)
                        }
                        className="font-black text-xs px-1 hover:text-green-600"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => eliminarDelCarrito(index)}
                      className="bg-red-100 text-red-500 w-7 h-7 rounded-full font-black hover:bg-red-500 hover:text-white transition-all text-[10px] ml-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t-4 border-black pt-6 flex justify-between items-center mb-8">
                <div className="flex flex-col text-left">
                  <span className="font-bold text-gray-400 text-xs uppercase tracking-widest">
                    Total
                  </span>
                  <span className="text-4xl font-black text-black italic leading-none">
                    ${total.toLocaleString('es-AR')}
                  </span>
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

      {/* SECCIÓN DE CONTACTO Y REDES */}
      <section className="bg-black text-white py-20 px-4 mt-20 border-t-8 border-yellow-400">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16 text-left">
          {/* Info Personal */}
          <div>
            <h4 className="font-black italic text-3xl mb-6 uppercase tracking-tighter">
              Viví la experiencia Misterybox🕵️👀
            </h4>
            <p className="opacity-60 font-bold mb-2 text-yellow-400">
              Ventas por Mayor y Menor
            </p>
            <p className="font-black text-xl">Somos Juanchy y Luis</p>
            <p className="font-bold text-pink-500">
              Contacto - 3731652931 - luistrassani@gmail.com
            </p>
            <p className="opacity-60 mt-4 italic text-sm text-gray-400">
              Atención personalizada de fanáticos para fanáticos.
            </p>
          </div>

          {/* Ayuda Rápida */}
          <div>
            <h4 className="font-black italic text-3xl mb-6 uppercase tracking-tighter text-white">
              Ayuda
            </h4>
            <ul className="space-y-3 font-bold uppercase text-sm tracking-widest text-gray-400">
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">
                Envíos a todo el país
              </li>
              <li
                onClick={() => setVerTalles(true)}
                className="hover:text-yellow-400 cursor-pointer transition-colors"
              >
                Tabla de Talles 📏
              </li>
              <li
                onClick={() => setVerCuidados(true)}
                className="hover:text-yellow-400 cursor-pointer transition-colors"
              >
                Cómo cuidar tu camiseta 🧼
              </li>
            </ul>
          </div>

          {/* Botones de Redes */}
          <div>
            <h4 className="font-black italic text-3xl mb-6 uppercase tracking-tighter text-white">
              Nuestras Redes
            </h4>
            <div className="flex gap-6">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/casacon.ch/"
                target="_blank"
                className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all transform hover:-rotate-12"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/543731652931"
                target="_blank"
                className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-all transform hover:rotate-12"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        {/* VENTANA MODAL: TABLA DE TALLES - ESTILOS CORREGIDOS */}
        {verTalles && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white border-4 border-black p-6 rounded-[2rem] max-w-lg w-full relative shadow-[10px_10px_0px_0px_rgba(253,224,71,1)] text-left">
              <button
                onClick={() => setVerTalles(false)}
                className="absolute -top-4 -right-4 bg-pink-600 text-white w-10 h-10 rounded-full font-black border-4 border-black cursor-pointer hover:bg-black transition-colors"
              >
                X
              </button>

              {/* TEXTO EN NEGRO AQUÍ */}
              <h3 className="text-2xl font-black uppercase italic mb-4 text-black">
                Tabla de talles 📏
              </h3>
              <p className="text-[11px] font-bold text-gray-500 mb-4">
                * Las medidas son aproximadas y pueden variar 1 o 2 cm.
              </p>

              {/* Imagen de tu tabla */}
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                <img
                  src="https://lstaiadjehagsvyjhgvf.supabase.co/storage/v1/object/sign/CASACON/guia%20de%20talles%20casacon%20(2).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xODliMTNiYy1kMGU3LTQ4NmUtYmNmNi02NWIyMWFhMzE0ZmEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDQVNBQ09OL2d1aWEgZGUgdGFsbGVzIGNhc2Fjb24gKDIpLnBuZyIsImlhdCI6MTc3NTc5NTU0NiwiZXhwIjoxODA3MzMxNTQ2fQ.MgfFJhoNlAJAINuynM7ukfwKmlrJBo0KZD9QOE6fDys"
                  alt="Tabla de talles"
                  className="w-full rounded-lg"
                />
              </div>

              <button
                onClick={() => setVerTalles(false)}
                className="w-full mt-6 bg-black text-white py-3 rounded-xl font-black uppercase cursor-pointer hover:bg-pink-600 transition-all shadow-md"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
        {/* VENTANA MODAL: ZOOM DE PRODUCTO */}
        {productoZoom && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setProductoZoom(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-white rounded-[2rem] border-4 border-black overflow-hidden shadow-[15px_15px_0px_0px_rgba(253,224,71,1)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setProductoZoom(null)}
                className="absolute top-4 right-4 z-10 bg-pink-600 text-white w-12 h-12 rounded-full font-black border-4 border-black hover:scale-110 transition-transform"
              >
                ✕
              </button>

              <div className="flex flex-col md:flex-row">
                {/* IMAGEN GRANDE - CORREGIDA */}
                <div className="md:w-2/3 bg-gray-100 p-6 flex items-center justify-center min-h-[400px]">
                  <img
                    src={obtenerImagenPrincipal(productoZoom)}
                    className="max-h-[70vh] w-auto object-contain transition-all duration-300"
                    alt={productoZoom.nombre}
                  />
                </div>

                {/* INFO LATERAL */}
                <div className="md:w-1/3 p-8 text-left flex flex-col justify-center bg-white">
                  <h2 className="text-3xl font-black uppercase italic mb-2 leading-none text-black">
                    {productoZoom.nombre}
                  </h2>
                  <p className="text-4xl font-black text-pink-600 mb-6">
                    ${productoZoom.precio.toLocaleString('es-AR')}
                  </p>

                  <div className="space-y-4">
                    <p className="font-bold text-gray-500 text-xs uppercase italic">
                      Vistas disponibles:
                    </p>

                    {/* GALERÍA DE MINIATURAS DENTRO DEL ZOOM */}
                    <div className="flex gap-2 flex-wrap">
                      {[
                        productoZoom.imagen_url ||
                          productoZoom.imagen ||
                          productoZoom.img,
                        productoZoom.imagen_url_2,
                        productoZoom.imagen_url_3,
                        productoZoom.gen_url_4, // Corregido según tu interfaz
                      ]
                        .filter(Boolean)
                        .map((img, i) => (
                          <button
                            key={i}
                            onClick={() =>
                              setImagenSeleccionada({
                                ...imagenSeleccionada,
                                [productoZoom.id]: img!,
                              })
                            }
                            className={`w-16 h-16 border-2 rounded-xl overflow-hidden transition-all ${
                              obtenerImagenPrincipal(productoZoom) === img
                                ? 'border-pink-600 scale-105'
                                : 'border-gray-200 hover:border-black'
                            }`}
                          >
                            <img
                              src={img}
                              className="w-full h-full object-contain p-1"
                            />
                          </button>
                        ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      agregarAlCarrito(productoZoom);
                      setProductoZoom(null);
                    }}
                    className="mt-10 w-full bg-yellow-400 border-4 border-black py-4 rounded-xl font-black uppercase hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                  >
                    Agregar ahora 🛒
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* VENTANA MODAL: CUIDADOS - ESTILOS CORREGIDOS */}
        {verCuidados && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white border-4 border-black p-8 rounded-[2.5rem] max-w-md w-full relative shadow-[10px_10px_0px_0px_rgba(219,39,119,1)] text-left">
              <button
                onClick={() => setVerCuidados(false)}
                className="absolute -top-4 -right-4 bg-yellow-400 text-black w-10 h-10 rounded-full font-black border-4 border-black cursor-pointer hover:bg-black hover:text-white transition-colors"
              >
                X
              </button>

              {/* TEXTO EN NEGRO AQUÍ */}
              <h3 className="text-2xl font-black uppercase italic mb-6 text-black tracking-tighter">
                Cómo cuidar tu camiseta👕
              </h3>

              <ul className="space-y-4 text-left font-bold text-sm text-black">
                <li className="flex gap-3 items-center">
                  <span className="text-lg">🧼</span>
                  <p>
                    Lavar siempre{' '}
                    <strong className="text-pink-600">
                      a mano y con agua fría
                    </strong>
                    .
                  </p>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="text-lg">🚫</span>
                  <p>
                    No usar lavarropas ni centrifugado (arruina parches y
                    estampados).
                  </p>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="text-lg">☀️</span>
                  <p>
                    Secar siempre{' '}
                    <strong className="text-yellow-500">a la sombra</strong>,
                    nunca al sol directo.
                  </p>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="text-lg">💨</span>
                  <p>
                    Evitar el uso de suavizante, puede despegar los detalles.
                  </p>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="text-lg">👔</span>
                  <p>
                    Evita el planchado directo: usa temperatura suave y un paño
                    de barrera para cuidar la tela.
                  </p>
                </li>
              </ul>

              <button
                onClick={() => setVerCuidados(false)}
                className="w-full mt-8 bg-black text-white py-4 rounded-2xl font-black uppercase cursor-pointer hover:bg-pink-600 transition-all shadow-md"
              >
                ¡GRACIAS!
              </button>
            </div>
          </div>
        )}
      </section>

      <footer className="bg-black text-center py-10 border-t border-gray-900">
        <p className="opacity-40 text-[10px] font-black uppercase tracking-[0.3em] text-white">
          Casacón © 2026 - Hecho por Luis Trassani 🚀
        </p>
      </footer>

      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; animation: marquee 25s linear infinite; }
      `}</style>
    </div>
  );
}
