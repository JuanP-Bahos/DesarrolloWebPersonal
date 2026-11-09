import type { NextFunction, Request, Response } from 'express';

/**
 * Middleware de registro (logger).
 * Imprime en consola cada petición: método, URL, código de respuesta y duración.
 * Ejemplo:  POST /api/productos -> 201 (12 ms)
 */
export function registrarPeticiones(req: Request, res: Response, next: NextFunction) {
  const inicio = Date.now();

  // 'finish' se dispara cuando la respuesta ya se envió al cliente.
  res.on('finish', () => {
    const duracion = Date.now() - inicio;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${duracion} ms)`);
  });

  next(); // pasa el control al siguiente middleware o ruta
}
