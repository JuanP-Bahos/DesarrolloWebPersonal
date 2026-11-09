import { app } from './app';
import { conectarBaseDeDatos, desconectarBaseDeDatos } from './config/database';
import { env } from './config/env';

/**
 * PUNTO DE ENTRADA DEL BACKEND
 * 1. Conecta con MongoDB.
 * 2. Si la conexión funciona, enciende el servidor HTTP.
 * Si MongoDB no está disponible, el servidor no arranca y muestra el motivo.
 */
async function iniciarServidor() {
  try {
    await conectarBaseDeDatos(env.mongodbUri);

    const servidor = app.listen(env.port, () => {
      console.log(`[API] Servidor escuchando en http://localhost:${env.port}/api`);
    });

    // Cierre ordenado con Ctrl + C
    process.on('SIGINT', async () => {
      servidor.close();
      await desconectarBaseDeDatos();
      process.exit(0);
    });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    console.error('[API] No se pudo iniciar el servidor:', mensaje);
    console.error('      ¿Está encendido MongoDB? ¿Es correcta MONGODB_URI en backend/.env?');
    process.exit(1);
  }
}

iniciarServidor();
