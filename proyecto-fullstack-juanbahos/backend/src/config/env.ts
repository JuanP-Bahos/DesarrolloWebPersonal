import dotenv from 'dotenv';

// Lee el archivo .env y copia sus valores en process.env.
// quiet: true evita que dotenv imprima mensajes en la consola.
dotenv.config({ quiet: true });

/**
 * Devuelve el valor de una variable de entorno obligatoria.
 * Si no existe, detiene el programa con un mensaje claro.
 */
function leerVariableObligatoria(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) {
    console.error(`[Config] Falta la variable de entorno ${nombre}.`);
    console.error('         Copia backend/.env.example como backend/.env y revisa sus valores.');
    process.exit(1); // 1 = el programa terminó por un error
  }
  return valor;
}

/**
 * Configuración de la aplicación en un solo lugar.
 * El resto del código importa `env` en lugar de leer process.env directamente.
 */
export const env = {
  port: Number(process.env.PORT) || 3000,
  mongodbUri: leerVariableObligatoria('MONGODB_URI'),
  // "http://localhost:5173,http://127.0.0.1:5173" -> ['http://localhost:5173', 'http://127.0.0.1:5173']
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origen) => origen.trim()),
};
