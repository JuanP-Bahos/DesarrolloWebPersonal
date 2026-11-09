import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { estaConectada } from './config/database';
import { manejarErrores, rutaNoEncontrada } from './middlewares/manejarErrores';
import { registrarPeticiones } from './middlewares/registrarPeticiones';
import { productoRouter } from './routes/producto.routes';

/**
 * Configuración de la aplicación Express.
 * El ORDEN importa: cada petición pasa por los middlewares de arriba hacia abajo.
 */
export const app = express();

// 1. Muestra en consola cada petición recibida (va primero para registrarlas todas).
app.use(registrarPeticiones);

// 2. CORS: permite que el frontend (otro origen: localhost:5173) consuma la API.
app.use(cors({ origin: env.corsOrigins }));

// 3. Convierte el cuerpo JSON de la petición en un objeto disponible en req.body.
app.use(express.json());

// 4. Rutas
app.get('/api/salud', (_req, res) => {
  res.status(200).json({
    estado: 'ok',
    baseDeDatos: estaConectada() ? 'conectada' : 'desconectada',
    fecha: new Date().toISOString(),
  });
});

app.use('/api/productos', productoRouter);

// 5. Si ninguna ruta respondió: 404
app.use(rutaNoEncontrada);

// 6. Manejo centralizado de errores (siempre al final)
app.use(manejarErrores);
