import type { Producto } from '../types/producto';
import { formatearPrecio, obtenerEstadoStock } from '../utils/formato';

interface ProductoFilaProps {
  producto: Producto;
  estaEditando: boolean;
  onEditar: (producto: Producto) => void;
  onEliminar: (producto: Producto) => void;
  onCambiarStock: (producto: Producto, cantidad: number) => void;
}

const TEXTO_ESTADO = {
  agotado: 'Agotado',
  bajo: 'Stock bajo',
  normal: 'Disponible',
};

/** Una fila de la tabla: muestra un producto y sus botones de acción. */
export function ProductoFila({ producto, estaEditando, onEditar, onEliminar, onCambiarStock }: ProductoFilaProps) {
  const estado = obtenerEstadoStock(producto.stock);

  return (
    <tr className={estaEditando ? 'fila--editando' : undefined}>
      <td className="celda--codigo">{producto.codigo}</td>
      <td>
        <div className="celda__nombre">{producto.nombre}</div>
        {/* Renderizado condicional: la descripción solo se muestra si existe */}
        {producto.descripcion && <div className="celda__descripcion">{producto.descripcion}</div>}
      </td>
      <td>{producto.categoria}</td>
      <td className="celda--numero">{formatearPrecio(producto.precio)}</td>
      <td>
        <div className="stock">
          <button
            type="button"
            className="boton-icono"
            aria-label={`Restar una unidad a ${producto.nombre}`}
            disabled={producto.stock === 0}
            onClick={() => onCambiarStock(producto, -1)}
          >
            −
          </button>
          <span className="stock__cantidad">{producto.stock}</span>
          <button
            type="button"
            className="boton-icono"
            aria-label={`Sumar una unidad a ${producto.nombre}`}
            onClick={() => onCambiarStock(producto, 1)}
          >
            +
          </button>
        </div>
      </td>
      <td>
        <span className={`etiqueta etiqueta--${estado}`}>{TEXTO_ESTADO[estado]}</span>
      </td>
      <td>
        <div className="acciones">
          <button type="button" className="boton boton--secundario boton--pequeno" onClick={() => onEditar(producto)}>
            Editar
          </button>
          <button type="button" className="boton boton--peligro boton--pequeno" onClick={() => onEliminar(producto)}>
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
