import { ProductoModel } from '../models/producto.model';
import type { ProductoDatos } from '../types/producto.types';
import { HttpError } from '../utils/HttpError';

/**
 * CAPA DE SERVICIOS
 * Contiene la lógica de negocio y el acceso a los datos.
 * No conoce `req` ni `res`: recibe datos simples y devuelve datos simples.
 *
 * En la sesión 5 este archivo guardaba los productos en un arreglo en memoria.
 * En la sesión 8 lo reescribimos con MongoDB SIN cambiar los controladores.
 */

/** Lista todos los productos, del más reciente al más antiguo. */
export async function listarProductos() {
  // Si dos productos tienen la misma fecha, desempata por _id (también descendente).
  return ProductoModel.find().sort({ createdAt: -1, _id: -1 });
}

/** Busca un producto por su id. Lanza 404 si no existe. */
export async function obtenerProductoPorId(id: string) {
  const producto = await ProductoModel.findById(id);
  if (!producto) {
    throw new HttpError(404, `No existe un producto con el id ${id}`);
  }
  return producto;
}

/** Crea un producto nuevo. MongoDB genera el _id. */
export async function crearProducto(datos: ProductoDatos) {
  return ProductoModel.create(datos);
}

/**
 * Actualiza un producto.
 * - PUT envía todos los campos (reemplazo completo).
 * - PATCH envía solo algunos campos (actualización parcial).
 * En ambos casos usamos findByIdAndUpdate.
 */
export async function actualizarProducto(id: string, datos: Partial<ProductoDatos>) {
  const producto = await ProductoModel.findByIdAndUpdate(id, datos, {
    returnDocument: 'after', // devuelve el documento YA actualizado
    runValidators: true, // aplica las reglas del esquema también al actualizar
  });
  if (!producto) {
    throw new HttpError(404, `No existe un producto con el id ${id}`);
  }
  return producto;
}

/** Elimina un producto. Lanza 404 si no existe. */
export async function eliminarProducto(id: string): Promise<void> {
  const producto = await ProductoModel.findByIdAndDelete(id);
  if (!producto) {
    throw new HttpError(404, `No existe un producto con el id ${id}`);
  }
}
