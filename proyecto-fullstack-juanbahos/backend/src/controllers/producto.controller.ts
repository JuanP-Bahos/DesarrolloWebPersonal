import type { Request, Response } from 'express';
import * as productoService from '../services/producto.service';

/**
 * CAPA DE CONTROLADORES
 * Cada función:
 *   1. lee lo que necesita de la petición (req.params, req.body),
 *   2. llama al servicio,
 *   3. responde con el código de estado y el JSON adecuados.
 *
 * Express 5 captura automáticamente los errores de las funciones async
 * y los envía al middleware manejarErrores, por eso no usamos try/catch aquí.
 */

type ParametrosConId = { id: string };

// GET /api/productos
export async function listarProductos(_req: Request, res: Response) {
  const productos = await productoService.listarProductos();
  res.status(200).json(productos);
}

// GET /api/productos/:id
export async function obtenerProducto(req: Request<ParametrosConId>, res: Response) {
  const producto = await productoService.obtenerProductoPorId(req.params.id);
  res.status(200).json(producto);
}

// POST /api/productos
export async function crearProducto(req: Request, res: Response) {
  const productoCreado = await productoService.crearProducto(req.body);
  res.status(201).json(productoCreado); // 201 Created
}

// PUT /api/productos/:id  (reemplazo completo)
export async function reemplazarProducto(req: Request<ParametrosConId>, res: Response) {
  const productoActualizado = await productoService.actualizarProducto(req.params.id, req.body);
  res.status(200).json(productoActualizado);
}

// PATCH /api/productos/:id  (actualización parcial)
export async function actualizarProductoParcial(req: Request<ParametrosConId>, res: Response) {
  const productoActualizado = await productoService.actualizarProducto(req.params.id, req.body);
  res.status(200).json(productoActualizado);
}

// DELETE /api/productos/:id
export async function eliminarProducto(req: Request<ParametrosConId>, res: Response) {
  await productoService.eliminarProducto(req.params.id);
  res.status(204).send(); // 204 No Content: éxito, sin cuerpo de respuesta
}
