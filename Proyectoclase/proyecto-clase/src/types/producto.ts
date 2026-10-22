/**
 * TIPOS DEL PROYECTO
 * Aquí describimos la "forma" de los datos. TypeScript revisa que todo el código la respete.
 */

/** `as const` convierte el arreglo en una lista de valores fijos (no se puede cambiar). */
export const CATEGORIAS = ['Bebidas calientes', 'Bebidas frías', 'Panadería', 'Postres'] as const;

/** Tipo unión: 'Bebidas calientes' | 'Bebidas frías' | 'Panadería' | 'Postres' */
export type Categoria = (typeof CATEGORIAS)[number];

/** Con esta cantidad de unidades (o menos) un producto se considera "pocas unidades". */
export const UNIDADES_MINIMAS = 5;

/** Un producto del menú. */
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: Categoria; // solo acepta uno de los 4 valores de CATEGORIAS
  precio: number;
  unidades: number; // unidades disponibles hoy
}

/**
 * Datos que llegan del formulario para crear o editar.
 * Omit<> copia la interfaz Producto quitando el id (el id lo generamos nosotros).
 */
export type ProductoDatos = Omit<Producto, 'id'>;
