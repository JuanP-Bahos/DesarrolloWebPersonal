import { CATEGORIAS, type Categoria, type ProductoDatos } from '../types/producto';

/**
 * Valores del formulario.
 * Los inputs HTML siempre entregan texto, por eso precio y stock son string aquí.
 * Al enviar los convertimos a número (ver convertirAProductoDatos).
 */
export interface ValoresFormulario {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: Categoria | '';
  precio: string;
  stock: string;
}

/** Un posible mensaje de error por cada campo del formulario. */
export type ErroresFormulario = Partial<Record<keyof ValoresFormulario, string>>;

export const VALORES_INICIALES: ValoresFormulario = {
  codigo: '',
  nombre: '',
  descripcion: '',
  categoria: '',
  precio: '',
  stock: '',
};

/** Revisa los valores y devuelve un objeto con los errores encontrados (vacío si todo está bien). */
export function validarFormulario(valores: ValoresFormulario): ErroresFormulario {
  const errores: ErroresFormulario = {};

  const codigo = valores.codigo.trim();
  if (!codigo) {
    errores.codigo = 'El código es obligatorio';
  } else if (!/^[A-Za-z0-9-]{3,20}$/.test(codigo)) {
    errores.codigo = 'Usa de 3 a 20 letras, números o guiones';
  }

  const nombre = valores.nombre.trim();
  if (nombre.length < 3 || nombre.length > 80) {
    errores.nombre = 'El nombre debe tener entre 3 y 80 caracteres';
  }

  if (valores.descripcion.length > 300) {
    errores.descripcion = 'Máximo 300 caracteres';
  }

  if (!(CATEGORIAS as readonly string[]).includes(valores.categoria)) {
    errores.categoria = 'Selecciona una categoría';
  }

  const precio = Number(valores.precio);
  if (valores.precio.trim() === '' || Number.isNaN(precio) || precio < 0) {
    errores.precio = 'Ingresa un precio mayor o igual a 0';
  }

  const stock = Number(valores.stock);
  if (valores.stock.trim() === '' || !Number.isInteger(stock) || stock < 0) {
    errores.stock = 'Ingresa un número entero mayor o igual a 0';
  }

  return errores;
}

/** Convierte los valores del formulario (texto) en los datos que espera la API. */
export function convertirAProductoDatos(valores: ValoresFormulario): ProductoDatos {
  return {
    codigo: valores.codigo.trim().toUpperCase(),
    nombre: valores.nombre.trim(),
    descripcion: valores.descripcion.trim(),
    categoria: valores.categoria as Categoria, // ya validamos que no está vacía
    precio: Number(valores.precio),
    stock: Number(valores.stock),
  };
}
