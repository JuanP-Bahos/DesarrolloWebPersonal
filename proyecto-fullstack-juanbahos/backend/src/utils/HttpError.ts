/**
 * Error con código de estado HTTP.
 *
 * Los servicios y middlewares lanzan un HttpError cuando algo sale mal
 * (por ejemplo: 404 si el producto no existe) y el middleware manejarErrores
 * lo convierte en una respuesta JSON: { mensaje, errores? }.
 */
export class HttpError extends Error {
  status: number;
  errores?: string[];

  constructor(status: number, mensaje: string, errores?: string[]) {
    super(mensaje);
    this.name = 'HttpError';
    this.status = status;
    this.errores = errores;
  }
}
