# Sesión 7 — MongoDB

> **Proyecto:** StockFácil · **Bloque:** Persistencia (1 de 2) · **Duración:** 120 minutos
> **Punto de partida:** React y Express integrados, con datos en memoria (sesión 6).
> **Al terminar la sesión:** Express está **conectado a MongoDB** con Mongoose. Existe el **modelo `Producto`** con validaciones, un script `npm run seed` carga datos de ejemplo, y **listar, consultar por id y crear** ya leen y escriben en la base de datos. Actualizar y eliminar se migran en la sesión 8.

---

## 1. Objetivo de aprendizaje

Al finalizar la sesión, el estudiante será capaz de **explicar el modelo de datos documental de MongoDB** y de **conectar una API Express a MongoDB mediante Mongoose**, definiendo un esquema con validaciones y realizando las primeras operaciones de lectura y escritura persistentes.

## 2. Competencias

| Tipo | Competencia |
|------|-------------|
| Conceptual | Compara bases de datos relacionales y NoSQL, y explica qué son base de datos, colección, documento, BSON y ObjectId. |
| Conceptual | Explica qué aporta Mongoose (esquemas, validaciones, modelos) sobre el driver nativo. |
| Procedimental | Explora e inserta documentos con MongoDB Compass. |
| Procedimental | Configura la conexión con `MONGODB_URI`, define un esquema y un modelo, y usa `find`, `findById` y `create`. |
| Actitudinal | Protege las credenciales de la base de datos y no las escribe nunca en el código. |

## 3. Conceptos previos

- Sesión 5: capa de servicios y funciones `async`.
- Sesión 4: variables de entorno con `dotenv`.
- JSON: objetos anidados y arreglos.
- **MongoDB instalado** (Community + Compass) **o** una cuenta de Atlas creada (tarea de la sesión 6).

---

## 4. Teoría

### 4.1 NoSQL

- **Qué es:** una familia de bases de datos que **no** usan el modelo de tablas relacionales con SQL. Hay varios tipos: de documentos (MongoDB), clave-valor (Redis), columnares y de grafos.
- **Para qué sirve:** para guardar datos con estructuras flexibles, anidadas o que cambian con frecuencia, y para escalar horizontalmente.
- **Por qué se utiliza:** el modelo de documentos se parece a los objetos JSON que ya usa JavaScript, así que no hay que "traducir" entre objetos y tablas.
- **Comparación:**

  | Relacional (MySQL, PostgreSQL) | Documental (MongoDB) |
  |--------------------------------|----------------------|
  | Base de datos | Base de datos |
  | Tabla | **Colección** |
  | Fila | **Documento** |
  | Columna | Campo |
  | Esquema fijo definido en la BD | Esquema flexible (Mongoose lo define en el código) |
  | Relaciones con `JOIN` | Documentos embebidos o referencias |
  | SQL | Consultas con objetos: `{ categoria: 'Aseo' }` |

- **¿Cuándo NO elegir MongoDB?** Cuando hay muchas relaciones complejas entre entidades y transacciones críticas en todas partes, como en una contabilidad compleja. Un inventario sencillo encaja bien con documentos.

### 4.2 MongoDB

- **Qué es:** la base de datos NoSQL de documentos más usada. Es un **servidor** independiente que escucha, por defecto, en el puerto **27017**.
- **Para qué sirve:** para guardar y consultar los datos de la aplicación de forma **persistente**, es decir, en disco: sobreviven a los reinicios.
- **Por qué se utiliza:** encaja naturalmente con JavaScript/JSON, tiene un plan gratuito en la nube (Atlas) y herramientas visuales (Compass).
- **Aplicación en el proyecto:** la base `inventario_db` guarda la colección `productos`.

### 4.3 Database, Collection y Document

```
Servidor MongoDB (localhost:27017)
└── Database: inventario_db
    └── Collection: productos
        ├── Document { _id: ObjectId("66f1..."), codigo: "ELE-001", nombre: "Audífonos...", ... }
        ├── Document { _id: ObjectId("66f2..."), codigo: "PAP-001", ... }
        └── ...
```

- **Database:** contenedor de colecciones. Una aplicación suele usar una.
- **Collection:** grupo de documentos del mismo tipo. MongoDB la crea automáticamente con el primer documento que se inserta.
- **Document:** un registro con forma de objeto JSON, con campos y valores. Cada documento tiene un `_id` único.

### 4.4 BSON

- **Qué es:** *Binary JSON*, el formato **binario** en el que MongoDB guarda los documentos.
- **Para qué sirve:** es más rápido de leer y admite **más tipos** que JSON: `Date`, `ObjectId`, enteros de 32 y 64 bits, `Decimal128` y datos binarios.
- **Por qué se utiliza:** JSON solo tiene texto, número, booleano, null, objeto y arreglo. Una fecha en JSON es texto; en BSON es una **fecha real**, que se puede ordenar y comparar.
- **Aplicación en el proyecto:** `createdAt` se guarda como `Date` en BSON. Al responder con JSON, Express la convierte en texto ISO: `"2026-09-30T21:11:54.618Z"`.

### 4.5 ObjectId

- **Qué es:** el tipo de identificador que MongoDB asigna por defecto a `_id`. Son 12 bytes, que se muestran como **24 caracteres hexadecimales**: `66f1a2b3c4d5e6f7a8b9c0d1`.
- **Para qué sirve:** identifica cada documento de forma única **sin** consultar a la base de datos (se genera en el cliente o en el servidor).
- **Por qué se utiliza:** incluye la **fecha de creación** en sus primeros 4 bytes, así que ordenar por `_id` equivale a ordenar por antigüedad.
- **Ejemplo sencillo:** en mongosh, `ObjectId("66f1a2b3c4d5e6f7a8b9c0d1").getTimestamp()`.
- **Aplicación en el proyecto:** los ids dejan de ser UUID y pasan a ser ObjectId. Como el frontend trata el id como un simple `string`, **no hay que cambiarlo**. En la sesión 8 validaremos que el `:id` tenga 24 caracteres hexadecimales.

### 4.6 MongoDB Compass

- **Qué es:** la interfaz gráfica oficial de MongoDB.
- **Para qué sirve:** para ver bases, colecciones y documentos; insertar, editar y borrar a mano; hacer consultas con filtros; y ver los índices.
- **Por qué se utiliza:** permite **ver** lo que hace nuestra API. Es la mejor herramienta para verificar que los datos realmente se guardaron.
- **Aplicación en el proyecto:** después de crear un producto desde React, lo buscaremos en Compass con el filtro `{ codigo: "PAP-010" }`.

### 4.7 Conexión desde Node.js

- **Qué es:** el backend abre una conexión con el servidor de MongoDB usando una **cadena de conexión** (URI).
- **Formatos de URI:**
  ```
  Local:  mongodb://127.0.0.1:27017/inventario_db
  Atlas:  mongodb+srv://USUARIO:CONTRASENA@cluster0.xxxxx.mongodb.net/inventario_db
          └─protocolo─┘ └─credenciales─┘ └──────servidor──────────┘ └─base─┘
  ```
- **Por qué `127.0.0.1` y no `localhost`:** en algunos sistemas `localhost` se resuelve primero como IPv6 (`::1`) y MongoDB no escucha allí, lo que produce el error `ECONNREFUSED ::1:27017`. `127.0.0.1` lo evita.
- **Orden de arranque:** primero se conecta a la base de datos y **después** se enciende el servidor HTTP. Si no hay base de datos, no tiene sentido aceptar peticiones.

### 4.8 Variables de entorno y credenciales

- **Qué es:** `MONGODB_URI` va en `backend/.env`, **nunca** en el código.
- **Por qué:** la URI de Atlas contiene **usuario y contraseña**. Si se sube a GitHub, en minutos hay bots que la encuentran y la usan.
- **Aplicación en el proyecto:** `config/env.ts` exige `MONGODB_URI` y, si falta, detiene el servidor con un mensaje claro. `.env.example` trae ejemplos **sin** credenciales reales.
- **Si una contraseña se filtra:** cambiarla de inmediato en Atlas. Borrarla del repositorio **no basta**, porque sigue en el historial de Git.

### 4.9 Mongoose

- **Qué es:** una librería **ODM** (*Object Data Modeling*) para MongoDB en Node.js. Se ubica sobre el driver oficial.
- **Para qué sirve:** para definir **esquemas** (qué campos, tipos y reglas tiene un documento), crear **modelos** (una clase para consultar y guardar) y aplicar **validaciones** y transformaciones automáticas.
- **Por qué se utiliza (pedagógicamente):** MongoDB acepta cualquier documento. Mongoose trae **orden**: si falta el nombre o el stock es negativo, rechaza el documento antes de guardarlo. Además, su API es simple: `Producto.find()`, `Producto.create()`.
- **Ejemplo sencillo:**
  ```ts
  const esquema = new Schema({ nombre: { type: String, required: true } });
  const Producto = model('Producto', esquema);   // colección: "productos"
  await Producto.create({ nombre: 'Café' });
  const todos = await Producto.find();
  ```
- **Aplicación en el proyecto:** `models/producto.model.ts` define el esquema con validaciones, `timestamps` (fechas automáticas) y una transformación `toJSON` que convierte `_id` en `id`. Así el frontend sigue recibiendo `id` y **no hay que cambiarlo**.

**Buenas prácticas que aparecen hoy:** credenciales en `.env`; conectar la base de datos antes de escuchar; validaciones también a nivel de esquema (defensa en profundidad); índice único para el código; y datos de ejemplo reproducibles con un script (`seed`).

---

## 5. Distribución de los 120 minutos

| Tiempo | Actividad | Descripción |
|--------|-----------|-------------|
| 0 – 10 min | Introducción | El problema: los datos se pierden. Verificar que MongoDB esté instalado. |
| 10 – 35 min | Teoría | NoSQL, MongoDB, database/collection/document, BSON, ObjectId, Compass, conexión, env y Mongoose. |
| 35 – 50 min | Demostración | Compass: crear la base, la colección y documentos a mano; consultas con filtros. |
| 50 – 95 min | Desarrollo guiado | Mongoose, conexión, modelo, seed y migración de listar, obtener y crear. |
| 95 – 110 min | Taller | Verificación cruzada React ↔ Compass y análisis de los "500" pendientes. |
| 110 – 120 min | Cierre | Preguntas, evidencia y tarea. |

---

## 6. Libreto del docente

### 0 – 10 min · Introducción

> **Docente:** "La clase pasada reiniciamos el servidor y los productos desaparecieron. Hoy le damos **memoria permanente** a StockFácil."

- Revisar rápidamente quién tiene MongoDB local funcionando y quién usará Atlas. Emparejar a quien tenga problemas con alguien que ya lo tenga listo. **Plan B:** si alguien no pudo instalar, que use Atlas desde el navegador.
  > **Pregunta:** *"¿Dónde guarda los datos una base de datos para que sobrevivan a un reinicio?"* (En el disco.)

### 10 – 35 min · Teoría

- **Relacional vs documental (7 min):** mostrar el mismo producto como fila de una tabla SQL y como documento JSON. Agregar al documento un arreglo `proveedores: [...]` y preguntar: *"¿Cómo lo harían en una tabla?"* (Otra tabla y un JOIN.)
- **Jerarquía (4 min):** dibujar el diagrama 4.3.
- **BSON y ObjectId (4 min):** mostrar que un ObjectId contiene la fecha de creación.
- **URI y credenciales (5 min):** escribir la URI de Atlas en el tablero y marcar la parte secreta.
  > **Pregunta:** *"¿En qué archivo va esta cadena? ¿Y en cuál NO puede ir nunca?"*
- **Mongoose (5 min):** analogía: MongoDB es una bodega donde cabe cualquier caja; Mongoose es el **encargado de recepción** que solo deja entrar cajas con etiqueta, peso y contenido correctos.

### 35 – 50 min · Demostración con Compass

1. Conectar a `mongodb://127.0.0.1:27017` (o la URI de Atlas).
2. *Create database* → nombre `inventario_db`, colección `productos`.
3. *Add data* → *Insert document*:
   ```json
   { "codigo": "DEMO-1", "nombre": "Producto de prueba", "categoria": "Otros", "precio": 1000, "stock": 3 }
   ```
   Señalar el `_id` generado automáticamente.
4. Insertar otro documento **con un campo extra** (`"color": "rojo"`) y **sin** `precio`.
   > **Pregunta:** *"¿MongoDB lo aceptó?"* Sí. Por eso usaremos Mongoose: MongoDB por sí solo no exige estructura.
5. Filtro: `{ stock: { $lt: 5 } }` → operadores de consulta (`$lt` = menor que).
6. Borrar la base `inventario_db` (la recreará el script `seed`).

### 50 – 95 min · Desarrollo guiado

- Pasos 1 a 9.
- **Momento de interacción (paso 5, modelo):** comparar las reglas del esquema con las de `validarProducto.ts` y las del frontend. *"¿Por qué validar tres veces?"* Cada capa protege algo distinto: la experiencia del usuario (React), la API ante cualquier cliente (middleware) y la integridad de la base de datos ante cualquier código que escriba en ella, incluidos scripts (esquema).
- **Momento de interacción (paso 8, servicio):** preguntar: *"¿Tocamos el controlador? ¿Y el frontend?"* No. **Esa es la recompensa de la arquitectura por capas.**

### 95 – 110 min · Taller

Actividad práctica. Al final, provocar a propósito los dos "500" del paso 9 y dejar la pregunta abierta: *"¿Qué código deberían devolver? Lo resolvemos la próxima clase."*

### 110 – 120 min · Cierre

> "Hoy los datos ya se guardan en disco. La próxima sesión terminamos la migración (actualizar y eliminar), convertimos los errores de MongoDB en respuestas claras y cerramos el proyecto de extremo a extremo."

---

## 7. Desarrollo práctico

### Paso 1 — Instalar Mongoose y configurar la URI

- **Archivo:** — (comando) y `.env.example` / `.env`
- **Ruta:** `backend/`

```bash
# dentro de backend/
npm install mongoose
```

```bash
# ─────────────────────────────────────────────────────────────
# Variables de entorno del BACKEND
# 1. Copia este archivo y renómbralo como .env   (cp .env.example .env)
# 2. Ajusta los valores. El archivo .env NUNCA se sube a Git.
# ─────────────────────────────────────────────────────────────

# Puerto donde escucha la API
PORT=3000

# Cadena de conexión a MongoDB
# Opción A - MongoDB instalado en tu computador:
MONGODB_URI=mongodb://127.0.0.1:27017/inventario_db
# Opción B - MongoDB Atlas (reemplaza USUARIO, CONTRASENA y CLUSTER con tus datos):
# MONGODB_URI=mongodb+srv://USUARIO:CONTRASENA@CLUSTER.mongodb.net/inventario_db?retryWrites=true&w=majority

# Origen(es) del frontend autorizados por CORS (separa varios con coma)
CORS_ORIGIN=http://localhost:5173
```

Copiar las líneas nuevas a `backend/.env` y ajustar `MONGODB_URI`.

**Si usas Atlas:**
1. *Database Access* → crear un usuario con contraseña (evita caracteres como `@`, `:` o `/`; si los usas, deben codificarse, por ejemplo `@` → `%40`).
2. *Network Access* → *Add IP Address* → *Add current IP address* (en clase se puede usar `0.0.0.0/0` temporalmente).
3. *Connect* → *Drivers* → copiar la URI, reemplazar `<password>` y **agregar el nombre de la base** antes del `?`: `...mongodb.net/inventario_db?retryWrites=true&w=majority`.

- **Explicación:** Mongoose incluye el driver oficial de MongoDB. El nombre de la base de datos va al final de la URI; si no existe, MongoDB la crea con el primer documento.
- **Resultado esperado:** `mongoose` aparece en `dependencies` de `package.json`.
- **Errores frecuentes:** olvidar el nombre de la base en la URI de Atlas → los datos quedan en una base llamada `test`.

### Paso 2 — Exigir la variable `MONGODB_URI`

- **Archivo:** `env.ts` (versión final)
- **Ruta:** `backend/src/config/env.ts`

```ts
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
```

- **Explicación:** `leerVariableObligatoria` falla **al arrancar** si falta la variable, con un mensaje que dice exactamente cómo solucionarlo. Es mejor fallar pronto y claro que fallar después con un error confuso.
- **Resultado esperado:** si se comenta `MONGODB_URI` en `.env`, el servidor no arranca y muestra *Falta la variable de entorno MONGODB_URI...*.
- **Errores frecuentes:** ninguno relevante.

### Paso 3 — Módulo de conexión

- **Archivo:** `database.ts`
- **Ruta:** `backend/src/config/database.ts`

```ts
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
```

- **Explicación:** `mongoose.connect` devuelve una Promesa: se espera con `await`. `serverSelectionTimeoutMS: 5000` hace que, si MongoDB no responde, el error llegue en 5 segundos en lugar de 30. `readyState === 1` significa "conectado".
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** ninguno en este paso (los errores de conexión aparecen en el paso 4).

### Paso 4 — Conectar antes de escuchar

- **Archivo:** `server.ts` (versión final)
- **Ruta:** `backend/src/server.ts`

```ts
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
```

- **Archivo:** `app.ts` (versión final: la ruta de salud informa el estado de la base)
- **Ruta:** `backend/src/app.ts`

```ts
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
```

- **Explicación:** `iniciarServidor` es `async`: primero `await conectarBaseDeDatos(...)` y luego `app.listen(...)`. Si la conexión falla, el `catch` muestra el motivo y termina el proceso con código 1 (error). `SIGINT` (Ctrl + C) cierra la conexión de forma ordenada.
- **Resultado esperado** con `npm run dev`:
  ```
  [MongoDB] Conectado a la base de datos "inventario_db"
  [API] Servidor escuchando en http://localhost:3000/api
  ```
  y `GET /api/salud` → `{ "estado": "ok", "baseDeDatos": "conectada", ... }`.
- **Errores frecuentes:**

  | Mensaje | Causa | Solución |
  |---------|-------|----------|
  | `connect ECONNREFUSED 127.0.0.1:27017` | El servicio de MongoDB no está encendido | Windows: *Servicios* → *MongoDB Server* → Iniciar. macOS: `brew services start mongodb-community`. Linux: `sudo systemctl start mongod` |
  | `connect ECONNREFUSED ::1:27017` | Se usó `localhost` y se resolvió a IPv6 | Usar `127.0.0.1` |
  | `bad auth : authentication failed` | Usuario o contraseña de Atlas incorrectos | Revisar *Database Access*; codificar caracteres especiales |
  | `Server selection timed out` (Atlas) | Tu IP no está autorizada o la red bloquea el puerto | *Network Access* en Atlas; probar otra red |
  | `querySrv ENOTFOUND` | URI `mongodb+srv` mal copiada o DNS bloqueado | Copiar la URI de nuevo desde Atlas |

### Paso 5 — Modelo `Producto`

- **Archivo:** `producto.model.ts`
- **Ruta:** `backend/src/models/producto.model.ts`

```ts
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
```

- **Explicación:**
  - Cada campo define su `type` y sus **validadores** con mensaje: `required`, `minlength`/`maxlength`, `min`, `match` (expresión regular), `enum` y `validate` (función propia: `Number.isInteger`).
  - **Transformaciones:** `trim` y `uppercase` limpian los datos antes de guardar.
  - `unique: true` crea un **índice único** en MongoDB. Si se repite el código, MongoDB responde con el error **11000** (lo manejamos en la sesión 8).
  - `timestamps: true` agrega y mantiene `createdAt` y `updatedAt`.
  - `toJSON`: `virtuals: true` agrega `id` (el texto del `_id`) y `transform` elimina `_id`. Resultado: **el JSON tiene la misma forma que en la sesión 6**.
  - `model('Producto', ...)` → Mongoose pluraliza y usa la colección `productos`.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** escribir `type: string` (tipo de TypeScript, en minúscula) en lugar de `type: String` (constructor de JavaScript).

### Paso 6 — Script de datos de ejemplo (`seed`)

- **Archivo:** `seed.ts`
- **Ruta:** `backend/src/scripts/seed.ts`

```ts
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
```

- **Archivo:** `package.json` (agregar el script)
- **Ruta:** `backend/package.json`

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "seed": "tsx src/scripts/seed.ts",
  "typecheck": "tsc --noEmit"
}
```

```bash
npm run seed
```

- **Explicación:** el script se conecta, **borra** todos los productos (`deleteMany({})`), inserta los de ejemplo (`insertMany`) y se desconecta en `finally`. `insertMany` también pasa por las validaciones del esquema. Sirve para que todos los estudiantes partan de los **mismos datos**.
- **Resultado esperado:**
  ```
  [MongoDB] Conectado a la base de datos "inventario_db"
  [Seed] Productos eliminados: 0
  [Seed] Productos creados: 6
  [MongoDB] Conexión cerrada
  ```
  En Compass (pulsar *Refresh*): base `inventario_db` → colección `productos` → 6 documentos con `_id`, `createdAt` y `updatedAt`.
- **Errores frecuentes:** ejecutar `seed` en una base con datos reales: **los borra**. Nunca debe usarse en producción.

### Paso 7 — Qué pasa con los datos en memoria

- **Archivo:** `productos.data.ts`
- **Ruta:** `backend/src/data/productos.data.ts`

Por ahora **se conserva**: las funciones de actualizar y eliminar todavía lo usan. Se elimina en la sesión 8.

### Paso 8 — Migrar listar, obtener y crear a MongoDB

- **Archivo:** `producto.service.ts` (versión de transición)
- **Ruta:** `backend/src/services/producto.service.ts`

```ts
import { productosIniciales } from '../data/productos.data';
import { ProductoModel } from '../models/producto.model';
import type { Producto, ProductoDatos } from '../types/producto.types';
import { HttpError } from '../utils/HttpError';

/**
 * CAPA DE SERVICIOS (versión de la sesión 7: migración en curso)
 *   [HECHO]     listar, obtener por id y crear  -> ya usan MongoDB
 *   [PENDIENTE] actualizar y eliminar           -> siguen en memoria (se migran en la sesión 8)
 */

// =====================  YA MIGRADO A MONGODB  =====================

/** Lista todos los productos, del más reciente al más antiguo. */
export async function listarProductos() {
  // Si dos productos tienen la misma fecha, desempata por _id (también descendente).
  return ProductoModel.find().sort({ createdAt: -1, _id: -1 });
}

/** Busca un producto por su id. Lanza 404 si no existe. */
export async function obtenerProductoPorId(id: string) {
  const producto = await ProductoModel.findById(id);
  if (!producto) {
    throw new HttpError(404, `No existe un producto con el id ${id}`);
  }
  return producto;
}

/** Crea un producto nuevo. MongoDB genera el _id. */
export async function crearProducto(datos: ProductoDatos) {
  return ProductoModel.create(datos);
}

// =====================  PENDIENTE (sesión 8)  =====================
// Estas funciones todavía trabajan sobre el arreglo en memoria.
// Por eso, desde el frontend, editar o eliminar un producto de MongoDB responde 404.

const productos: Producto[] = [...productosIniciales];

export async function actualizarProducto(id: string, datos: Partial<ProductoDatos>): Promise<Producto> {
  const producto = productos.find((item) => item.id === id);
  if (!producto) {
    throw new HttpError(404, `No existe un producto con el id ${id}`);
  }
  Object.assign(producto, datos, { updatedAt: new Date() });
  return producto;
}

export async function eliminarProducto(id: string): Promise<void> {
  const indice = productos.findIndex((producto) => producto.id === id);
  if (indice === -1) {
    throw new HttpError(404, `No existe un producto con el id ${id}`);
  }
  productos.splice(indice, 1);
}
```

- **Explicación:**
  - `ProductoModel.find()` devuelve todos los documentos; `.sort({ createdAt: -1, _id: -1 })` los ordena del más nuevo al más antiguo (−1 = descendente).
  - `findById(id)` busca por `_id` y devuelve `null` si no existe → lanzamos 404.
  - `create(datos)` valida con el esquema, guarda y devuelve el documento creado, con `_id` y fechas.
  - El controlador llama a `res.json(documento)`, que usa la transformación `toJSON` del modelo.
  - **No se tocó** ningún controlador, ninguna ruta ni el frontend.
- **Resultado esperado:**
  - El frontend muestra los 6 productos del `seed`, ahora con ids de 24 caracteres (verlo en *Network*).
  - Crear un producto desde React → aparece en la tabla y, tras pulsar *Refresh* en Compass, también en la colección.
  - **Reiniciar el backend y recargar: el producto sigue ahí.**
- **Errores frecuentes:** olvidar `await` en el controlador o en el servicio → se responde un objeto `Query` o una Promesa en lugar de los datos.

### Paso 9 — Lo que queda pendiente (para la sesión 8)

Probar con REST Client o Thunder Client y **anotar** los resultados:

| Prueba | Resultado hoy | ¿Qué debería ser? |
|--------|---------------|-------------------|
| Editar o eliminar un producto desde React | 404 (el servicio busca en el arreglo en memoria) | 200 / 204 |
| `GET /api/productos/123` | **500** (Mongoose no puede convertir `123` en ObjectId: `CastError`) | 400 |
| Crear un producto con código `ELE-001` | **500** (MongoDB responde error 11000 por el índice único) | 409 |

En la terminal del backend, leer el detalle de cada `[Error no controlado]`: ahí está el nombre del error que manejaremos la próxima clase.

---

## 8. Actividad práctica (parejas, 15 min)

1. Crear 2 productos desde React y encontrarlos en Compass con el filtro `{ categoria: "Hogar" }` (o la que hayan usado).
2. Editar un documento **desde Compass** (cambiar el precio) y pulsar **Reintentar** o recargar el frontend. ¿Se refleja? ¿Por qué? (La base de datos es la fuente de verdad para todos.)
3. Intentar insertar desde Compass un documento con `"stock": -5`. ¿MongoDB lo acepta? ¿Y si se intenta desde la API? Explicar la diferencia: las validaciones de Mongoose solo actúan cuando se escribe **a través de Mongoose**.

## 9. Reto

Agregar un índice de búsqueda por categoría en el esquema (`categoria: { ..., index: true }`) y verificar en Compass, en la pestaña *Indexes*, que se creó. Investigar: ¿para qué sirve un índice y qué costo tiene?

## 10. Preguntas de comprobación (con respuesta esperada)

1. **¿Qué equivale en MongoDB a una tabla y a una fila?** Una colección y un documento.
2. **¿Qué es BSON y por qué no JSON puro?** Es el formato binario de MongoDB. Admite más tipos (Date, ObjectId, enteros) y es más eficiente.
3. **¿Qué es un ObjectId y qué información contiene?** El identificador por defecto de `_id`: 12 bytes (24 caracteres hexadecimales) que incluyen la fecha de creación.
4. **¿Qué aporta Mongoose si MongoDB ya guarda documentos?** Esquemas, validaciones, valores por defecto, transformaciones y una API de modelos sencilla.
5. **¿Por qué el servidor se conecta a MongoDB antes de `app.listen`?** Para no aceptar peticiones que no se podrían atender sin base de datos.
6. **¿Por qué el frontend no cambió aunque ahora los ids son ObjectId?** Porque trata el id como un `string` y el modelo transforma `_id` en `id`. La interfaz de la API se mantuvo.

## 11. Evidencia de aprendizaje

- Captura de Compass con la colección `productos` mostrando un documento creado desde React.
- Captura de la terminal con la salida de `npm run seed`.
- Prueba de persistencia: captura antes y después de reiniciar el backend, con el mismo producto presente.
- Commit: `git commit -m "Sesión 7: conexión a MongoDB con Mongoose, modelo y seed"`.

## 12. Tarea (autónoma, ~1,5 h)

1. Completar la tabla del paso 9 con los mensajes exactos de error de la terminal (`CastError`, `E11000 duplicate key error`).
2. Leer en la documentación de Mongoose: *Queries* (`findByIdAndUpdate`, `findByIdAndDelete`) y *Validation* (sección `runValidators`).
3. **Preparación para la sesión 8:** escribir en pseudocódigo cómo quedarían `actualizarProducto` y `eliminarProducto` usando el modelo.
