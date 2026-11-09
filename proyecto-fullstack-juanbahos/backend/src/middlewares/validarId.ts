import type { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { HttpError } from '../utils/HttpError';

/**
 * Verifica que el parámetro :id tenga el formato de un ObjectId de MongoDB
 * (24 caracteres hexadecimales, por ejemplo 66f1a2b3c4d5e6f7a8b9c0d1).
 * Si no lo tiene, responde 400 sin llegar a consultar la base de datos.
 */
export function validarId(req: Request<{ id: string }>, _res: Response, next: NextFunction) {
  if (!isValidObjectId(req.params.id)) {
    throw new HttpError(400, `El id "${req.params.id}" no tiene un formato válido`);
  }
  next();
}
