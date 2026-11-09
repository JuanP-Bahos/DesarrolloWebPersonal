import { STOCK_MINIMO } from '../types/producto';

// Se crea una sola vez y se reutiliza (crear un formateador es costoso).
const formateadorPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** 89900 -> "$ 89.900" */
export function formatearPrecio(valor: number): string {
  return formateadorPesos.format(valor);
}

export type EstadoStock = 'agotado' | 'bajo' | 'normal';

/** Clasifica el stock de un producto para mostrar la etiqueta correcta. */
export function obtenerEstadoStock(stock: number): EstadoStock {
  if (stock === 0) return 'agotado';
  if (stock <= STOCK_MINIMO) return 'bajo';
  return 'normal';
}
