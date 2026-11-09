import type { NextFunction, Request, Response } from 'express';
import { CATEGORIAS } from '../types/producto.types';
import { HttpError } from '../utils/HttpError';

/** Únicos campos que el cliente puede enviar (lista blanca). */
const CAMPOS_PERMITIDOS = ['codigo', 'nombre', 'descripcion', 'categoria', 'precio', 'stock'];

const PATRON_CODIGO = /^[A-Za-z0-9-]{3,20}$/;

/**
 * Revisa los datos de un producto y devuelve la lista de errores encontrados.
 * @param datos      cuerpo de la petición (req.body)
 * @param esParcial  true para PATCH: solo se validan los campos que llegaron
 */
function validarDatosProducto(datos: Record<string, unknown>, esParcial: boolean): string[] {
  const errores: string[] = [];

  // En PATCH solo validamos los campos enviados; en POST y PUT, todos.
  const debeValidar = (campo: string) => !esParcial || datos[campo] !== undefined;

  if (debeValidar('codigo')) {
    const codigo = datos.codigo;
    if (typeof codigo !== 'string' || !PATRON_CODIGO.test(codigo.trim())) {
      errores.push('El código es obligatorio: de 3 a 20 caracteres (letras, números o guiones)');
    }
  }

  if (debeValidar('nombre')) {
    const nombre = datos.nombre;
    if (typeof nombre !== 'string' || nombre.trim().length < 3 || nombre.trim().length > 80) {
      errores.push('El nombre es obligatorio y debe tener entre 3 y 80 caracteres');
    }
  }

  // La descripción es opcional incluso en POST y PUT.
  if (datos.descripcion !== undefined) {
    const descripcion = datos.descripcion;
    if (typeof descripcion !== 'string' || descripcion.length > 300) {
      errores.push('La descripción debe ser un texto de máximo 300 caracteres');
    }
  }

  if (debeValidar('categoria')) {
    const categoria = datos.categoria;
    if (typeof categoria !== 'string' || !(CATEGORIAS as readonly string[]).includes(categoria)) {
      errores.push(`La categoría es obligatoria y debe ser una de: ${CATEGORIAS.join(', ')}`);
    }
  }

  if (debeValidar('precio')) {
    const precio = datos.precio;
    if (typeof precio !== 'number' || !Number.isFinite(precio) || precio < 0) {
      errores.push('El precio es obligatorio y debe ser un número mayor o igual a 0');
    }
  }

  if (debeValidar('stock')) {
    const stock = datos.stock;
    if (typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0) {
      errores.push('El stock es obligatorio y debe ser un número entero mayor o igual a 0');
    }
  }

  return errores;
}

/** Copia solo los campos permitidos; ignora cualquier otro (por ejemplo "id" o "createdAt"). */
function tomarCamposPermitidos(datos: Record<string, unknown>): Record<string, unknown> {
  const limpio: Record<string, unknown> = {};
  for (const campo of CAMPOS_PERMITIDOS) {
    if (datos[campo] !== undefined) {
      limpio[campo] = datos[campo];
    }
  }
  return limpio;
}

/** Lógica común de los dos middlewares de validación. */
function validar(req: Request, esParcial: boolean): void {
  const cuerpo: unknown = req.body;

  if (typeof cuerpo !== 'object' || cuerpo === null || Array.isArray(cuerpo)) {
    throw new HttpError(400, 'El cuerpo de la petición debe ser un objeto JSON');
  }

  const datos = tomarCamposPermitidos(cuerpo as Record<string, unknown>);

  if (esParcial && Object.keys(datos).length === 0) {
    throw new HttpError(400, 'Envía al menos un campo para actualizar', [
      `Campos permitidos: ${CAMPOS_PERMITIDOS.join(', ')}`,
    ]);
  }

  const errores = validarDatosProducto(datos, esParcial);
  if (errores.length > 0) {
    throw new HttpError(400, 'Los datos del producto no son válidos', errores);
  }

  req.body = datos; // el controlador recibe solo datos limpios
}

/** Para POST y PUT: todos los campos obligatorios deben venir. */
export function validarProductoCompleto(req: Request, _res: Response, next: NextFunction) {
  validar(req, false);
  next();
}

/** Para PATCH: se validan únicamente los campos enviados. */
export function validarProductoParcial(req: Request, _res: Response, next: NextFunction) {
  validar(req, true);
  next();
}
