import mongoose from 'mongoose';

/**
 * Abre la conexión con MongoDB usando Mongoose.
 * Se llama una sola vez, al iniciar el servidor (ver server.ts).
 */
export async function conectarBaseDeDatos(uri: string): Promise<void> {
  // serverSelectionTimeoutMS: si MongoDB no responde en 5 s, falla con un error
  // en lugar de quedarse esperando indefinidamente.
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log(`[MongoDB] Conectado a la base de datos "${mongoose.connection.name}"`);
}

/** Cierra la conexión (la usan el script seed y el apagado del servidor). */
export async function desconectarBaseDeDatos(): Promise<void> {
  await mongoose.disconnect();
  console.log('[MongoDB] Conexión cerrada');
}

/** Indica si la conexión está activa (lo usa la ruta /api/salud). */
export function estaConectada(): boolean {
  return mongoose.connection.readyState === 1;
}
