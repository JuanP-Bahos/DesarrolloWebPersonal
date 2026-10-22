import { UNIDADES_MINIMAS, type Categoria } from '../types/producto';

// Se crea una sola vez y se reutiliza (crear un formateador en cada llamada es costoso).
const formateadorPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** 3500 -> "$ 3.500" */
export function formatearPrecio(valor: number): string {
  return formateadorPesos.format(valor);
}

/** Los tres estados posibles de las unidades de un producto. */
export type EstadoUnidades = 'agotado' | 'pocas' | 'disponible';

/** Regla de negocio en un solo lugar: clasifica las unidades para mostrar la etiqueta correcta. */
export function obtenerEstadoUnidades(unidades: number): EstadoUnidades {
  if (unidades === 0) return 'agotado';
  if (unidades <= UNIDADES_MINIMAS) return 'pocas';
  return 'disponible';
}

/** Record<Categoria, string>: TypeScript exige un emoji para CADA categoría. */
export const EMOJI_CATEGORIA: Record<Categoria, string> = {
  'Bebidas calientes': '☕',
  'Bebidas frías': '🥤',
  Panadería: '🥐',
  Postres: '🍰',
};