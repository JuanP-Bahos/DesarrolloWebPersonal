import { Schema, model } from 'mongoose';
import { CATEGORIAS } from '../types/producto.types';

/**
 * Esquema de Mongoose: describe la forma de cada documento de la colección
 * "productos" y las reglas que debe cumplir antes de guardarse en MongoDB.
 */
const productoSchema = new Schema(
  {
    codigo: {
      type: String,
      required: [true, 'El código es obligatorio'],
      unique: true, // MongoDB crea un índice único: no se repiten códigos
      trim: true, // quita espacios al inicio y al final
      uppercase: true, // "pap-001" se guarda como "PAP-001"
      minlength: [3, 'El código debe tener al menos 3 caracteres'],
      maxlength: [20, 'El código no puede superar 20 caracteres'],
      match: [/^[A-Za-z0-9-]+$/, 'El código solo admite letras, números y guiones'],
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [80, 'El nombre no puede superar 80 caracteres'],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [300, 'La descripción no puede superar 300 caracteres'],
      default: '',
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: {
        values: [...CATEGORIAS],
        message: 'La categoría "{VALUE}" no es válida',
      },
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      validate: {
        validator: Number.isInteger,
        message: 'El stock debe ser un número entero',
      },
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
    versionKey: false, // no guarda el campo interno __v
    toJSON: {
      virtuals: true, // incluye el campo virtual "id" (texto del _id)
      transform: (_documento, objeto) => {
        // El frontend trabaja con "id"; ocultamos "_id" para no duplicarlo.
        const { _id, ...productoSinGuionBajo } = objeto;
        return productoSinGuionBajo;
      },
    },
  },
);

/**
 * Modelo: la "clase" con la que consultamos y guardamos productos.
 * Mongoose usa el nombre 'Producto' para crear la colección "productos".
 */
export const ProductoModel = model('Producto', productoSchema);
