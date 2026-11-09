import type { Producto, ProductoDatos } from '../types/producto';
import { solicitar } from './api';

/**
 * Servicio de productos: una función por cada endpoint de la API.
 * Los componentes llaman a estas funciones y NUNCA usan fetch directamente.
 */

const RUTA = '/productos';

/** GET /productos */
export function obtenerProductos(): Promise<Producto[]> {
  return solicitar<Producto[]>(RUTA);
}

/** GET /productos/:id */
export function obtenerProductoPorId(id: string): Promise<Producto> {
  return solicitar<Producto>(`${RUTA}/${id}`);
}

/** POST /productos */
export function crearProducto(datos: ProductoDatos): Promise<Producto> {
  return solicitar<Producto>(RUTA, {
    method: 'POST',
    body: JSON.stringify(datos), // objeto JS -> texto JSON
  });
}

/** PUT /productos/:id  (se envían todos los campos) */
export function actualizarProducto(id: string, datos: ProductoDatos): Promise<Producto> {
  return solicitar<Producto>(`${RUTA}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

/** PATCH /productos/:id  (se envían solo los campos que cambian) */
export function actualizarProductoParcial(id: string, cambios: Partial<ProductoDatos>): Promise<Producto> {
  return solicitar<Producto>(`${RUTA}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(cambios),
  });
}

/** DELETE /productos/:id */
export function eliminarProducto(id: string): Promise<void> {
  return solicitar<void>(`${RUTA}/${id}`, { method: 'DELETE' });
}
