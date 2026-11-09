import { useEffect, useState } from 'react';
import { Alerta, type MensajeAlerta } from '../components/Alerta';
import { BarraFiltros, type FiltroCategoria } from '../components/BarraFiltros';
import { Cargando } from '../components/Cargando';
import { ProductoFormulario } from '../components/ProductoFormulario';
import { ProductoTabla } from '../components/ProductoTabla';
import { ResumenInventario } from '../components/ResumenInventario';
import { ApiError, obtenerMensajeDeError } from '../services/api';
import * as productoService from '../services/productoService';
import type { Producto, ProductoDatos } from '../types/producto';

/**
 * Página principal del inventario.
 * Guarda el ESTADO de la pantalla y coordina a los componentes hijos:
 *   - los hijos reciben datos por props,
 *   - y avisan de las acciones del usuario con funciones (onGuardar, onEliminar...).
 */
export function InventarioPage() {
  // ---------- Estado ----------
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorDeCarga, setErrorDeCarga] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<MensajeAlerta | null>(null);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<FiltroCategoria>('Todas');
  const [intentoDeCarga, setIntentoDeCarga] = useState(0);

  // ---------- Carga de productos (GET) ----------
  // El efecto se ejecuta al mostrar la página y cada vez que cambia `intentoDeCarga`.
  useEffect(() => {
    let cancelado = false;

    async function cargarProductos() {
      try {
        const datos = await productoService.obtenerProductos();
        if (!cancelado) {
          setProductos(datos);
          setErrorDeCarga(null);
        }
      } catch (error) {
        if (!cancelado) setErrorDeCarga(obtenerMensajeDeError(error));
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargarProductos();

    // Limpieza: si el efecto se repite antes de que llegue la respuesta,
    // ignoramos la respuesta anterior. (En desarrollo, StrictMode ejecuta
    // el efecto dos veces a propósito: verás dos peticiones GET.)
    return () => {
      cancelado = true;
    };
  }, [intentoDeCarga]);

  function reintentarCarga() {
    setCargando(true);
    setErrorDeCarga(null);
    setIntentoDeCarga((intento) => intento + 1); // cambia la dependencia -> el efecto se repite
  }

  // ---------- Utilidades ----------
  function mostrarError(error: unknown) {
    setMensaje({
      tipo: 'error',
      texto: obtenerMensajeDeError(error),
      detalles: error instanceof ApiError ? error.errores : undefined,
    });
  }

  /** Reemplaza en la lista el producto que devolvió el servidor. */
  function reemplazarEnLista(productoActualizado: Producto) {
    setProductos((anteriores) =>
      anteriores.map((producto) => (producto.id === productoActualizado.id ? productoActualizado : producto)),
    );
  }

  // ---------- Crear y editar (POST / PUT) ----------
  function iniciarEdicion(producto: Producto) {
    setMensaje(null);
    setProductoEditando(producto);
  }

  async function guardarProducto(datos: ProductoDatos): Promise<boolean> {
    setGuardando(true);
    setMensaje(null);
    try {
      if (productoEditando) {
        const actualizado = await productoService.actualizarProducto(productoEditando.id, datos);
        reemplazarEnLista(actualizado);
        setProductoEditando(null);
        setMensaje({ tipo: 'exito', texto: `Producto "${actualizado.nombre}" actualizado.` });
      } else {
        const creado = await productoService.crearProducto(datos);
        setProductos((anteriores) => [creado, ...anteriores]);
        setMensaje({ tipo: 'exito', texto: `Producto "${creado.nombre}" agregado al inventario.` });
      }
      return true;
    } catch (error) {
      mostrarError(error);
      return false;
    } finally {
      setGuardando(false);
    }
  }

  // ---------- Eliminar (DELETE) ----------
  async function eliminarProducto(producto: Producto) {
    const confirmado = window.confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    setMensaje(null);
    try {
      await productoService.eliminarProducto(producto.id);
      setProductos((anteriores) => anteriores.filter((item) => item.id !== producto.id));
      if (productoEditando?.id === producto.id) {
        setProductoEditando(null);
      }
      setMensaje({ tipo: 'exito', texto: `Producto "${producto.nombre}" eliminado.` });
    } catch (error) {
      mostrarError(error);
    }
  }

  // ---------- Ajustar stock (PATCH) ----------
  async function cambiarStock(producto: Producto, cantidad: number) {
    const nuevoStock = producto.stock + cantidad;
    if (nuevoStock < 0) return;

    try {
      const actualizado = await productoService.actualizarProductoParcial(producto.id, { stock: nuevoStock });
      reemplazarEnLista(actualizado);
    } catch (error) {
      mostrarError(error);
    }
  }

  // ---------- Filtros (valores derivados, no son estado) ----------
  const textoBuscado = busqueda.trim().toLowerCase();
  const productosFiltrados = productos.filter((producto) => {
    const coincideTexto =
      producto.nombre.toLowerCase().includes(textoBuscado) || producto.codigo.toLowerCase().includes(textoBuscado);
    const coincideCategoria = categoriaFiltro === 'Todas' || producto.categoria === categoriaFiltro;
    return coincideTexto && coincideCategoria;
  });

  // ---------- Renderizado condicional ----------
  function renderizarContenido() {
    if (cargando) {
      return <Cargando texto="Cargando inventario..." />;
    }

    if (errorDeCarga) {
      return (
        <div className="estado-error">
          <p>
            <strong>No pudimos cargar los productos.</strong>
          </p>
          <p>{errorDeCarga}</p>
          <button type="button" className="boton boton--primario" onClick={reintentarCarga}>
            Reintentar
          </button>
        </div>
      );
    }

    return (
      <>
        <ResumenInventario productos={productos} />

        <div className="inventario">
          <section className="panel panel--formulario">
            {/* La key cambia al editar otro producto: React crea un formulario nuevo con esos datos. */}
            <ProductoFormulario
              key={productoEditando?.id ?? 'nuevo'}
              productoInicial={productoEditando}
              guardando={guardando}
              onGuardar={guardarProducto}
              onCancelar={() => setProductoEditando(null)}
            />
          </section>

          <section className="panel">
            <div className="panel__cabecera">
              <h2 className="panel__titulo">Productos</h2>
              <span className="panel__contador">
                {productosFiltrados.length} de {productos.length}
              </span>
            </div>
            <BarraFiltros
              busqueda={busqueda}
              categoria={categoriaFiltro}
              onBusquedaChange={setBusqueda}
              onCategoriaChange={setCategoriaFiltro}
            />
            <ProductoTabla
              productos={productosFiltrados}
              idEditando={productoEditando?.id ?? null}
              onEditar={iniciarEdicion}
              onEliminar={eliminarProducto}
              onCambiarStock={cambiarStock}
            />
          </section>
        </div>
      </>
    );
  }

  return (
    <main className="contenedor">
      {mensaje && <Alerta mensaje={mensaje} onCerrar={() => setMensaje(null)} />}
      {renderizarContenido()}
    </main>
  );
}
