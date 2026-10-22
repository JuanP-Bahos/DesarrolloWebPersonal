import type { Producto } from '../types/producto';

/**
 * DATOS DE EJEMPLO
 * Son el valor inicial del estado. Más adelante vendrían de un servidor (API).
 * 🧪 Prueba: cambia una categoría por 'Comida rápida' y mira el error de TypeScript.
 */
export const productosIniciales: Producto[] = [
  {
    id: '1',
    nombre: 'Café tinto',
    descripcion: 'El clásico colombiano, suave y aromático.',
    categoria: 'Bebidas calientes',
    precio: 3500,
    unidades: 30,
  },
  {
    id: '2',
    nombre: 'Capuchino',
    descripcion: 'Espresso con leche espumada y canela.',
    categoria: 'Bebidas calientes',
    precio: 7000,
    unidades: 4,
  },
  {
    id: '3',
    nombre: 'Limonada de coco',
    descripcion: '',
    categoria: 'Bebidas frías',
    precio: 9500,
    unidades: 12,
  },
  {
    id: '4',
    nombre: 'Pandebono',
    descripcion: 'Recién horneado, con queso costeño.',
    categoria: 'Panadería',
    precio: 2500,
    unidades: 0,
  },
  {
    id: '5',
    nombre: 'Almojábana',
    descripcion: 'Suave y esponjosa, ideal con chocolate.',
    categoria: 'Panadería',
    precio: 2800,
    unidades: 20,
  },
  {
    id: '6',
    nombre: 'Postre de natas',
    descripcion: 'Receta tradicional de la abuela.',
    categoria: 'Postres',
    precio: 8000,
    unidades: 3,
  },
];