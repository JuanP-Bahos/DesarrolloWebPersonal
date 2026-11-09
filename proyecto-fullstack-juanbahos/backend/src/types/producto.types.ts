/**
 * Categorías permitidas.
 * `as const` le dice a TypeScript que este arreglo no cambiará,
 * así puede usar sus valores exactos como tipo.
 */
export const CATEGORIAS = ['Electrónica', 'Papelería', 'Alimentos', 'Aseo', 'Hogar', 'Otros'] as const;

/** Tipo unión: 'Electrónica' | 'Papelería' | 'Alimentos' | 'Aseo' | 'Hogar' | 'Otros' */
export type Categoria = (typeof CATEGORIAS)[number];

/** Datos que envía el cliente para crear o actualizar un producto. */
export interface ProductoDatos {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: Categoria;
  precio: number;
  stock: number;
}

/** Producto completo, tal como lo devuelve la API. */
export interface Producto extends ProductoDatos {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
