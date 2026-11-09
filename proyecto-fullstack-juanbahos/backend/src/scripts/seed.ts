/**
 * SCRIPT DE DATOS DE EJEMPLO (seed = "sembrar")
 * Borra la colección de productos y la llena con datos de prueba.
 *
 * Uso:  npm run seed
 */
import { conectarBaseDeDatos, desconectarBaseDeDatos } from '../config/database';
import { env } from '../config/env';
import { ProductoModel } from '../models/producto.model';
import type { ProductoDatos } from '../types/producto.types';

const productosDeEjemplo: ProductoDatos[] = [
  {
    codigo: 'ELE-001',
    nombre: 'Audífonos inalámbricos',
    descripcion: 'Bluetooth 5.3, estuche de carga',
    categoria: 'Electrónica',
    precio: 89900,
    stock: 12,
  },
  {
    codigo: 'ELE-002',
    nombre: 'Cable USB-C 1 m',
    descripcion: 'Carga rápida 60 W',
    categoria: 'Electrónica',
    precio: 15900,
    stock: 3,
  },
  {
    codigo: 'PAP-001',
    nombre: 'Cuaderno cuadriculado 100 hojas',
    descripcion: 'Tamaño carta, tapa dura',
    categoria: 'Papelería',
    precio: 7500,
    stock: 40,
  },
  {
    codigo: 'PAP-002',
    nombre: 'Esfero negro',
    descripcion: '',
    categoria: 'Papelería',
    precio: 1200,
    stock: 0,
  },
  {
    codigo: 'ALI-001',
    nombre: 'Café molido 500 g',
    descripcion: 'Origen Huila, tostión media',
    categoria: 'Alimentos',
    precio: 24500,
    stock: 18,
  },
  {
    codigo: 'ASE-001',
    nombre: 'Jabón líquido de manos',
    descripcion: 'Presentación de 1 litro',
    categoria: 'Aseo',
    precio: 11900,
    stock: 5,
  },
];

async function sembrarDatos() {
  try {
    await conectarBaseDeDatos(env.mongodbUri);

    const { deletedCount } = await ProductoModel.deleteMany({});
    console.log(`[Seed] Productos eliminados: ${deletedCount}`);

    const creados = await ProductoModel.insertMany(productosDeEjemplo);
    console.log(`[Seed] Productos creados: ${creados.length}`);
  } catch (error) {
    console.error('[Seed] Error al cargar los datos:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await desconectarBaseDeDatos();
  }
}

sembrarDatos();
