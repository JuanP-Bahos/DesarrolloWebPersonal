import type { Producto } from '../types/producto';
import { ProductoFila } from './ProductoFila';

interface ProductoTablaProps {
  productos: Producto[];
  idEditando: string | null;
  onEditar: (producto: Producto) => void;
  onEliminar: (producto: Producto) => void;
  onCambiarStock: (producto: Producto, cantidad: number) => void;
}

/** Tabla de productos. Si la lista está vacía muestra un mensaje. */
export function ProductoTabla({ productos, idEditando, onEditar, onEliminar, onCambiarStock }: ProductoTablaProps) {
  if (productos.length === 0) {
    return <p className="vacio">No hay productos para mostrar.</p>;
  }

  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th className="celda--numero">Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* map() convierte cada producto en una fila. La prop key ayuda a React a identificar cada fila. */}
          {productos.map((producto) => (
            <ProductoFila
              key={producto.id}
              producto={producto}
              estaEditando={producto.id === idEditando}
              onEditar={onEditar}
              onEliminar={onEliminar}
              onCambiarStock={onCambiarStock}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
