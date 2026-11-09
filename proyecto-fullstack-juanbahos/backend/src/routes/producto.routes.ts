import { Router } from 'express';
import {
  actualizarProductoParcial,
  crearProducto,
  eliminarProducto,
  listarProductos,
  obtenerProducto,
  reemplazarProducto,
} from '../controllers/producto.controller';
import { validarId } from '../middlewares/validarId';
import { validarProductoCompleto, validarProductoParcial } from '../middlewares/validarProducto';

/**
 * CAPA DE RUTAS
 * Asocia cada método HTTP + URL con los middlewares y el controlador que lo atienden.
 * Todas estas rutas quedan bajo el prefijo /api/productos (ver app.ts).
 */
export const productoRouter = Router();

productoRouter.get('/', listarProductos);
productoRouter.get('/:id', validarId, obtenerProducto);
productoRouter.post('/', validarProductoCompleto, crearProducto);
productoRouter.put('/:id', validarId, validarProductoCompleto, reemplazarProducto);
productoRouter.patch('/:id', validarId, validarProductoParcial, actualizarProductoParcial);
productoRouter.delete('/:id', validarId, eliminarProducto);
