import { STOCK_MINIMO, type Producto } from '../types/producto';
import { formatearPrecio } from '../utils/formato';

interface ResumenInventarioProps {
  productos: Producto[];
}

/** Muestra cuatro indicadores calculados a partir de la lista de productos. */
export function ResumenInventario({ productos }: ResumenInventarioProps) {
  // Valores derivados: se calculan en cada render, no necesitan su propio estado.
  const totalProductos = productos.length;
  const totalUnidades = productos.reduce((suma, producto) => suma + producto.stock, 0);
  const valorInventario = productos.reduce((suma, producto) => suma + producto.precio * producto.stock, 0);
  const productosConStockBajo = productos.filter((producto) => producto.stock <= STOCK_MINIMO).length;

  return (
    <section className="resumen" aria-label="Resumen del inventario">
      <article className="resumen__tarjeta">
        <span className="resumen__etiqueta">Productos</span>
        <strong className="resumen__valor">{totalProductos}</strong>
      </article>
      <article className="resumen__tarjeta">
        <span className="resumen__etiqueta">Unidades en stock</span>
        <strong className="resumen__valor">{totalUnidades}</strong>
      </article>
      <article className="resumen__tarjeta">
        <span className="resumen__etiqueta">Valor del inventario</span>
        <strong className="resumen__valor">{formatearPrecio(valorInventario)}</strong>
      </article>
      <article className={`resumen__tarjeta ${productosConStockBajo > 0 ? 'resumen__tarjeta--alerta' : ''}`}>
        <span className="resumen__etiqueta">Stock bajo (≤ {STOCK_MINIMO})</span>
        <strong className="resumen__valor">{productosConStockBajo}</strong>
      </article>
    </section>
  );
}
