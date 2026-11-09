/**
 * Categorías permitidas (deben coincidir con las del backend).
 * `as const` convierte el arreglo en una lista de valores fijos.
 */
export const CATEGORIAS = ['Electrónica', 'Papelería', 'Alimentos', 'Aseo', 'Hogar', 'Otros'] as const;

/** 'Electrónica' | 'Papelería' | 'Alimentos' | 'Aseo' | 'Hogar' | 'Otros' */
export type Categoria = (typeof CATEGORIAS)[number];

/** A partir de esta cantidad (o menos) un producto se considera con stock bajo. */
export const STOCK_MINIMO = 5;

/** Un producto tal como lo devuelve la API. */
export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: Categoria;
  precio: number;
  stock: number;
  createdAt: string; // las fechas llegan como texto en el JSON
  updatedAt: string;
}

/**
 * Datos que enviamos para crear o actualizar un producto.
 * Omit<> copia la interfaz Producto quitando los campos que genera el servidor.
 */
export type ProductoDatos = Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>;
