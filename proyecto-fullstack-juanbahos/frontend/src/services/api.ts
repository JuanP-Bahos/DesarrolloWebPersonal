/**
 * Cliente HTTP de la aplicación.
 * Centraliza fetch: URL base, encabezados, conversión a JSON y manejo de errores.
 */

// La URL de la API se lee de las variables de entorno (archivo .env).
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

/** Error con la información que devuelve el backend: { mensaje, errores? } */
export class ApiError extends Error {
  status: number;
  errores: string[];

  constructor(status: number, mensaje: string, errores: string[] = []) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status; // 0 significa "no hubo respuesta del servidor"
    this.errores = errores;
  }
}

interface RespuestaDeError {
  mensaje?: string;
  errores?: string[];
}

/**
 * Hace una petición a la API y devuelve el cuerpo de la respuesta ya convertido.
 * @param ruta     por ejemplo '/productos' o '/productos/123'
 * @param opciones method, body, etc. (las mismas de fetch)
 */
export async function solicitar<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  let respuesta: Response;

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      // Solo indicamos Content-Type cuando enviamos un cuerpo JSON (POST, PUT, PATCH).
      headers: opciones.body ? { 'Content-Type': 'application/json' } : undefined,
      ...opciones,
    });
  } catch {
    // fetch solo falla aquí si NO hubo respuesta: servidor apagado, URL mal escrita, CORS...
    throw new ApiError(0, 'No se pudo conectar con el servidor. Verifica que el backend esté encendido.');
  }

  // 204 No Content: la operación funcionó pero no hay cuerpo (por ejemplo, DELETE).
  if (respuesta.status === 204) {
    return undefined as T;
  }

  const cuerpo: unknown = await respuesta.json().catch(() => null);

  // respuesta.ok es true para los códigos 200-299.
  if (!respuesta.ok) {
    const error = (cuerpo ?? {}) as RespuestaDeError;
    throw new ApiError(respuesta.status, error.mensaje ?? `Error ${respuesta.status}`, error.errores ?? []);
  }

  return cuerpo as T;
}

/** Convierte cualquier error en un texto que podamos mostrar al usuario. */
export function obtenerMensajeDeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Ocurrió un error inesperado';
}
