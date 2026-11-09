import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { HttpError } from '../utils/HttpError';

/**
 * Se ejecuta cuando ninguna ruta coincidió con la petición.
 * Debe registrarse DESPUÉS de todas las rutas.
 */
export function rutaNoEncontrada(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, `La ruta ${req.method} ${req.originalUrl} no existe`));
}

/** Forma del error que lanza MongoDB cuando se repite un valor único. */
interface ErrorClaveDuplicada {
  code: number;
  keyValue?: Record<string, unknown>;
}

function esErrorClaveDuplicada(error: unknown): error is ErrorClaveDuplicada {
  return typeof error === 'object' && error !== null && (error as ErrorClaveDuplicada).code === 11000;
}

/**
 * Middleware de manejo de errores (tiene 4 parámetros: err, req, res, next).
 * Convierte cualquier error en una respuesta JSON con el formato:
 *   { "mensaje": "...", "errores": ["..."] }
 * Debe registrarse al FINAL de app.ts.
 */
export function manejarErrores(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  // 1. Errores que lanzamos nosotros (404, 400, ...)
  if (error instanceof HttpError) {
    res.status(error.status).json({ mensaje: error.message, errores: error.errores });
    return;
  }

  // 2. JSON mal escrito en el cuerpo de la petición (lo detecta express.json)
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
    return;
  }

  // 3. Reglas del esquema de Mongoose que no se cumplen
  if (error instanceof mongoose.Error.ValidationError) {
    const errores = Object.values(error.errors).map((detalle) => detalle.message);
    res.status(400).json({ mensaje: 'Los datos del producto no son válidos', errores });
    return;
  }

  // 4. Un valor no se pudo convertir al tipo esperado (por ejemplo, un id mal formado)
  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({ mensaje: `El valor "${String(error.value)}" no es válido para ${error.path}` });
    return;
  }

  // 5. Índice único violado (código 11000): ya existe un producto con ese código
  if (esErrorClaveDuplicada(error)) {
    const codigo = error.keyValue?.codigo;
    const mensaje = codigo
      ? `Ya existe un producto con el código ${String(codigo)}`
      : 'Ya existe un producto con ese código';
    res.status(409).json({ mensaje });
    return;
  }

  // 6. Cualquier otro error: no mostramos detalles internos al cliente.
  console.error('[Error no controlado]', error);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
}
