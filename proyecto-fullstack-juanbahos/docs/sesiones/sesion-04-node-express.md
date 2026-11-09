# Sesión 4 — Node.js + Express

> **Proyecto:** StockFácil · **Bloque:** Backend (1 de 3) · **Duración:** 120 minutos
> **Punto de partida:** frontend completo con servicio HTTP listo (sesión 3).
> **Al terminar la sesión:** existe la carpeta `backend/` con una API Express en TypeScript que responde `GET /api/salud` y `GET /api/productos`, con CORS, variables de entorno, un middleware de registro y respuestas 404/500 en JSON.

---

## 1. Objetivo de aprendizaje

Al finalizar la sesión, el estudiante será capaz de **crear un servidor HTTP con Node.js y Express en TypeScript** que exponga endpoints REST que respondan en JSON, usando middlewares, variables de entorno, CORS y códigos de estado adecuados.

## 2. Competencias

| Tipo | Competencia |
|------|-------------|
| Conceptual | Explica qué es Node.js, qué resuelve Express y cómo viaja una petición a través de la cadena de middlewares. |
| Conceptual | Explica qué es CORS y por qué el navegador bloquea peticiones entre orígenes distintos. |
| Procedimental | Inicializa un proyecto Node con TypeScript, instala dependencias y configura scripts. |
| Procedimental | Define rutas GET, lee `req` y responde con `res.status().json()`. |
| Procedimental | Escribe middlewares propios y un manejador de errores. |
| Actitudinal | Mantiene la configuración fuera del código y protege los archivos sensibles con `.gitignore`. |

## 3. Conceptos previos

- Sesión 3: HTTP, métodos, códigos de estado, JSON y variables de entorno.
- JavaScript: funciones, módulos (`import`/`export`) y funciones flecha.
- Terminal: moverse entre carpetas y tener **dos terminales abiertas** a la vez.

---

## 4. Teoría

### 4.1 Node.js

- **Qué es:** un **entorno de ejecución** que permite ejecutar JavaScript **fuera del navegador**: en el servidor o en tu computador.
- **Para qué sirve:** para construir servidores web, APIs, herramientas de línea de comandos y scripts.
- **Por qué se utiliza:** permite usar **un solo lenguaje** (JavaScript/TypeScript) en el frontend y en el backend. Es muy eficiente atendiendo muchas peticiones gracias a su modelo asíncrono (*event loop*).
- **Ejemplo sencillo:** crear `hola.js` con `console.log('Hola desde Node')` y ejecutarlo con `node hola.js`.
- **Diferencias con el navegador:** en Node **no** existen `window` ni `document`, pero sí hay acceso a archivos (`fs`), a la red y a las variables del sistema (`process.env`).
- **Aplicación en el proyecto:** el backend de StockFácil es un programa Node que queda escuchando peticiones en el puerto 3000.

### 4.2 Express

- **Qué es:** el *framework* web minimalista más usado de Node.js.
- **Para qué sirve:** para definir **rutas** (qué hacer ante `GET /api/productos`), **middlewares** y respuestas de forma sencilla.
- **Por qué se utiliza:** con el módulo `http` nativo de Node habría que leer URLs, métodos y cuerpos a mano. Express lo simplifica y es el estándar de facto. En Express 5 (la versión que usamos), los errores de funciones `async` llegan solos al manejador de errores.
- **Ejemplo sencillo:**
  ```ts
  import express from 'express';
  const app = express();
  app.get('/hola', (req, res) => { res.json({ mensaje: 'Hola' }); });
  app.listen(3000);
  ```
- **Aplicación en el proyecto:** `backend/src/app.ts` configura Express y `server.ts` lo enciende.

### 4.3 Servidor HTTP

- **Qué es:** un programa que **escucha** en un **puerto** y responde las peticiones HTTP que llegan.
- **Para qué sirve:** para atender a los clientes (navegadores, apps móviles, otras APIs).
- **Por qué se utiliza:** es la pieza central del modelo cliente-servidor.
- **Ejemplo sencillo:** `app.listen(3000, () => console.log('Escuchando'))`. El programa **no termina**: queda esperando peticiones hasta que se pulse `Ctrl + C`.
- **Aplicación en el proyecto:** frontend en el puerto **5173** (Vite) y backend en el **3000** (Express). Son dos servidores distintos.

### 4.4 Request y Response

- **Qué es:** los dos objetos que recibe cada ruta: `req` (la petición que llegó) y `res` (la respuesta que vamos a enviar).
- **Para qué sirve:** `req` permite leer lo que envió el cliente; `res` permite responderle.
- **Por qué se utiliza:** es la interfaz de Express sobre HTTP.

  | `req` (lo que llega) | Ejemplo |
  |----------------------|---------|
  | `req.method` | `'GET'` |
  | `req.params` | `/productos/:id` → `req.params.id` |
  | `req.query` | `/productos?categoria=Aseo` → `req.query.categoria` |
  | `req.body` | Cuerpo JSON (requiere `express.json()`) |
  | `req.headers` | Encabezados |

  | `res` (lo que respondemos) | Uso |
  |----------------------------|-----|
  | `res.status(201)` | Fija el código de estado |
  | `res.json(objeto)` | Envía JSON (y el `Content-Type` adecuado) |
  | `res.send()` | Envía una respuesta, por ejemplo vacía con 204 |

- **Aplicación en el proyecto:** `res.status(200).json(productos)`.

### 4.5 Métodos HTTP en Express

- **Qué es:** Express tiene una función por método: `app.get`, `app.post`, `app.put`, `app.patch` y `app.delete`.
- **Para qué sirve:** para que una misma URL haga cosas distintas según el método.
- **Por qué se utiliza:** es exactamente el diseño REST de la sesión 3.
- **Ejemplo sencillo:** `app.get('/api/productos', listar)` y `app.post('/api/productos', crear)` comparten la URL y hacen cosas distintas.
- **Aplicación en el proyecto:** hoy, dos rutas GET. En la sesión 5, las siete del CRUD.

### 4.6 Rutas

- **Qué es:** la combinación **método + ruta (path)** asociada a una función manejadora.
- **Para qué sirve:** para definir los **endpoints** de la API.
- **Por qué se utiliza:** organiza la API de forma legible.
- **Ejemplo sencillo:** `app.get('/api/salud', (_req, res) => res.json({ estado: 'ok' }))`. El guion bajo en `_req` indica "este parámetro no lo uso".
- **Aplicación en el proyecto:** todas las rutas llevan el prefijo `/api` para distinguirlas de otros recursos.

### 4.7 Middleware

- **Qué es:** una función `(req, res, next)` que se ejecuta **entre** la llegada de la petición y la respuesta. Puede leer o modificar `req`/`res`, responder o pasar el control al siguiente con `next()`.
- **Para qué sirve:** para tareas **transversales** que aplican a muchas rutas: convertir JSON, CORS, registrar, validar o manejar errores.
- **Por qué se utiliza:** evita repetir el mismo código en cada ruta.
- **Ejemplo sencillo:**
  ```ts
  app.use((req, res, next) => {
    console.log(req.method, req.url);
    next(); // ¡sin next() la petición se queda "colgada"!
  });
  ```
- **La cadena (el orden importa):**
  ```
  Petición → registrarPeticiones → cors → express.json → RUTA → rutaNoEncontrada → manejarErrores → Respuesta
  ```
- **Aplicación en el proyecto:** `registrarPeticiones` (propio), `cors()` y `express.json()` (librerías), `rutaNoEncontrada` y `manejarErrores` (propios).

### 4.8 JSON en Express

- **Qué es:** `express.json()` es un middleware que lee el cuerpo de la petición y, si es JSON, lo convierte en objeto dentro de `req.body`. `res.json()` hace lo contrario.
- **Para qué sirve:** para recibir y enviar datos estructurados.
- **Por qué se utiliza:** sin `express.json()`, `req.body` es `undefined`.
- **Ejemplo sencillo:** si el cliente envía `{"nombre":"Café"}`, entonces `req.body.nombre === 'Café'`.
- **Aplicación en el proyecto:** registrado en `app.ts`. Si el JSON viene mal escrito, `manejarErrores` responde 400.

### 4.9 CORS

- **Qué es:** *Cross-Origin Resource Sharing*. Es un mecanismo del **navegador** que bloquea las peticiones de JavaScript hacia un **origen distinto** (protocolo + dominio + puerto), salvo que el servidor lo autorice con encabezados.
- **Para qué sirve:** protege al usuario: evita que una página maliciosa use tu sesión para llamar a otra API.
- **Por qué se utiliza (aquí):** `http://localhost:5173` (React) y `http://localhost:3000` (Express) son **orígenes distintos** porque cambia el puerto. Sin CORS, el navegador bloquea las respuestas de la API.
- **Ejemplo sencillo:** el servidor responde `Access-Control-Allow-Origin: http://localhost:5173` y así autoriza a ese origen.
- **Importante:** CORS lo aplica **el navegador**. Thunder Client, Postman o `curl` **no** tienen esa restricción. Por eso "en Postman funciona, pero en React no".
- **Aplicación en el proyecto:** `app.use(cors({ origin: env.corsOrigins }))`, con el origen leído de `.env`. **Buena práctica:** autorizar solo el origen necesario, no `*`.

### 4.10 Variables de entorno en Node

- **Qué es:** igual que en la sesión 3, pero en el servidor: se leen con `process.env.NOMBRE`. La librería `dotenv` carga el archivo `.env` en `process.env`.
- **Para qué sirve:** para configurar el puerto, los orígenes de CORS y, en la sesión 7, la conexión a la base de datos.
- **Por qué se utiliza:** en el backend las variables **sí pueden** ser secretas (contraseñas de base de datos), porque nunca llegan al navegador. Por eso `.env` **jamás** se sube a Git.
- **Ejemplo sencillo:** `const puerto = Number(process.env.PORT) || 3000;`
- **Aplicación en el proyecto:** `config/env.ts` lee todas las variables en **un solo lugar** y exporta el objeto `env`.

### 4.11 Códigos de estado

| Código | Nombre | Cuándo lo usa StockFácil |
|--------|--------|--------------------------|
| 200 | OK | GET, PUT o PATCH exitosos |
| 201 | Created | POST que creó un producto |
| 204 | No Content | DELETE exitoso (sin cuerpo) |
| 400 | Bad Request | Datos inválidos, JSON mal formado o id inválido |
| 404 | Not Found | Producto o ruta inexistente |
| 409 | Conflict | Código de producto repetido |
| 500 | Internal Server Error | Error inesperado del servidor |

- **Por qué importan:** el cliente decide qué hacer según el código, **no** según el texto. Responder `200 { "error": "no existe" }` es una mala práctica.

**Buenas prácticas que aparecen hoy:** separar `app.ts` (configuración) de `server.ts` (arranque); centralizar las variables de entorno; usar un **manejador de errores** único que nunca expone detalles internos al cliente; y proteger archivos con `.gitignore`.

---

## 5. Distribución de los 120 minutos

| Tiempo | Actividad | Descripción |
|--------|-----------|-------------|
| 0 – 10 min | Introducción | Del cliente al servidor: dónde estamos en la arquitectura. |
| 10 – 30 min | Teoría | Node.js, Express, servidor, req/res, rutas, middleware, JSON, CORS, env y códigos de estado. |
| 30 – 50 min | Demostración | Servidor mínimo en un solo archivo (10 líneas) probado con navegador y Thunder Client. |
| 50 – 90 min | Desarrollo guiado | Proyecto `backend/` completo con estructura, TypeScript, env, middlewares y rutas. |
| 90 – 110 min | Taller | Actividad práctica, prueba de CORS y reto. |
| 110 – 120 min | Cierre | Preguntas, evidencia y tarea. |

---

## 6. Libreto del docente

### 0 – 10 min · Introducción

> **Docente:** "Hasta ahora el navegador lo hacía todo. Hoy cruzamos al otro lado: vamos a construir el **servidor** que va a responder las peticiones que ya preparamos en `productoService.ts`."

Mostrar el diagrama y señalar la capa de hoy:

```
REACT ──HTTP──▶ [ EXPRESS ] ──▶ (MongoDB en la sesión 7)
                   ▲ hoy
```

> **Pregunta:** *"¿Por qué no guardamos los productos directamente desde React en la base de datos?"* Respuestas esperadas: seguridad (las credenciales quedarían expuestas en el navegador), validación centralizada y la posibilidad de tener varios clientes (web y móvil) usando la misma API.

### 10 – 30 min · Teoría

- **Node.js (3 min):** ejecutar `node -e "console.log(process.version, process.platform)"` en vivo.
- **Express, req y res (5 min):** retomar la analogía del restaurante: Express es el **jefe de cocina** que reparte los pedidos (rutas) a cada cocinero (función manejadora).
- **Middleware (5 min):** analogía del **control de seguridad del aeropuerto**. Cada filtro (documentos, equipaje, rayos X) revisa al pasajero y lo deja pasar (`next()`) o lo detiene (responde con un error). El orden de los filtros importa.
  > **Pregunta:** *"¿Qué pasa si un filtro no deja pasar a nadie ni dice nada?"* La fila se queda esperando para siempre: es una petición "colgada" por no llamar a `next()`.
- **CORS (5 min):** dibujar los dos orígenes con puertos distintos. Explicar que es una protección **del navegador**.
- **Códigos de estado (2 min):** repasar la tabla 4.11.

### 30 – 50 min · Demostración

En una carpeta temporal, **fuera** del proyecto:

```bash
mkdir demo-express && cd demo-express
npm init -y
npm install express
```

Crear `index.js`:

```js
const express = require('express');
const app = express();

app.get('/hola', (req, res) => {
  res.json({ mensaje: 'Hola desde Express', hora: new Date() });
});

app.listen(3000, () => console.log('http://localhost:3000/hola'));
```

Ejecutar con `node index.js` y abrir la URL en el navegador y en Thunder Client.

> **Pregunta:** *"¿Qué pasa si visito `/adios`?"* Express responde 404 con una página HTML. *"¿Es eso buena idea en una API?"* No: la API debe responder siempre JSON. Hoy lo corregimos.

### 50 – 90 min · Desarrollo guiado

- Pasos 1 a 11.
- **Momento de interacción (paso 3):** *"¿Por qué hay un `.env` y un `.env.example`? ¿Cuál se sube a Git?"*
- **Momento de interacción (paso 9):** antes de escribir `app.ts`, pedir a la clase que ordene en el tablero los middlewares y las rutas. Discutir por qué `manejarErrores` va al final.
- **Momento de interacción (paso 11):** mirar juntos la terminal del backend: cada petición deja una línea del middleware de registro.

### 90 – 110 min · Taller

Actividad práctica en parejas. Recorrer los puestos preguntando: *"¿qué código de estado esperabas y cuál obtuviste?"*

### 110 – 120 min · Cierre

> "Hoy la API solo **lee**. La próxima sesión haremos el CRUD completo, organizado en rutas, controladores y servicios, con validación y manejo de errores."

---

## 7. Desarrollo práctico

### Paso 1 — Crear el proyecto backend

- **Archivo:** — (comandos)
- **Ruta:** `proyecto-fullstack/backend/`

```bash
# Desde la carpeta proyecto-fullstack (NO dentro de frontend)
mkdir backend
cd backend
npm init -y
npm install express cors dotenv
npm install -D typescript@~6.0.2 tsx @types/express @types/cors @types/node@^22
mkdir -p src/config src/data src/middlewares src/types
```

- **Explicación:**
  - **Dependencias** (se necesitan al ejecutar): `express`, `cors`, `dotenv`.
  - **Dependencias de desarrollo** (`-D`, solo para programar): `typescript` (compilador), `tsx` (ejecuta TypeScript directamente y reinicia al guardar) y los paquetes `@types/...` (tipos de librerías escritas en JavaScript).
- **Resultado esperado:** se crean `package.json`, `package-lock.json` y `node_modules/`.
- **Errores frecuentes:**
  - Ejecutar los comandos dentro de `frontend/` → las dependencias se mezclan con las del frontend. Verificar la carpeta con `pwd`.
  - En Windows (CMD), `mkdir -p` no existe. Crear las carpetas desde VS Code o con PowerShell.

### Paso 2 — Scripts de `package.json` y configuración de TypeScript

- **Archivo:** `package.json` (editar la sección `scripts` y `main`)
- **Ruta:** `backend/package.json`

```json
{
  "name": "stockfacil-backend",
  "version": "1.0.0",
  "description": "API REST de StockFácil: Node.js + Express + TypeScript + MongoDB",
  "private": true,
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit"
  },
  "engines": {
    "node": ">=20.19"
  },
  "dependencies": { "...": "las que instaló npm (no las edites a mano)" },
  "devDependencies": { "...": "las que instaló npm" }
}
```

- **Archivo:** `tsconfig.json`
- **Ruta:** `backend/tsconfig.json`

```jsonc
{
  "compilerOptions": {
    /* Versión de JavaScript que generará tsc */
    "target": "es2023",
    "lib": ["ES2023"],
    "types": ["node"],

    /* Módulos: Node.js en modo CommonJS (sin "type": "module" en package.json).
       Así podemos escribir import/export sin agregar la extensión .js a cada ruta. */
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "esModuleInterop": true,

    /* Carpetas de entrada (código TS) y de salida (código JS compilado) */
    "rootDir": "src",
    "outDir": "dist",

    /* Revisiones estrictas: detectan errores antes de ejecutar */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- **Explicación:**
  - `npm run dev`: modo desarrollo con reinicio automático al guardar (`watch`).
  - `npm run build` + `npm start`: compila a JavaScript en `dist/` y lo ejecuta, como se haría en producción.
  - En `tsconfig.json`, `module: "nodenext"`, sin `"type": "module"` en `package.json`, hace que Node use CommonJS. Así podemos escribir `import ... from './app'` **sin** agregar la extensión `.js`.
- **Resultado esperado:** `npx tsc --version` muestra la versión 6.x.
- **Errores frecuentes:** si `npm init -y` agregó `"type": "module"`, borrarlo (o cambiarlo por `"commonjs"`); de lo contrario, Node exigirá extensiones en los imports.

### Paso 3 — Variables de entorno

- **Archivo:** `.env.example` (se versiona) y `.env` (local)
- **Ruta:** `backend/.env.example`

```bash
# Variables de entorno del BACKEND (sesión 4)
# Copia este archivo como .env

# Puerto donde escucha la API
PORT=3000

# Origen del frontend autorizado por CORS
CORS_ORIGIN=http://localhost:5173
```

```bash
cp .env.example .env
```

- **Archivo:** `.gitignore`
- **Ruta:** `proyecto-fullstack/.gitignore` (en la raíz, sirve para ambos proyectos)

```gitignore
# ─── Dependencias (se reinstalan con npm install) ───
node_modules/

# ─── Variables de entorno: pueden contener contraseñas ───
.env
.env.*
!.env.example

# ─── Archivos generados por la compilación ───
dist/
dist-ssr/
*.tsbuildinfo

# ─── Registros ───
logs/
*.log
npm-debug.log*

# ─── Sistema operativo y editores ───
.DS_Store
Thumbs.db
.idea/
.vscode/*
!.vscode/extensions.json
```

- **Explicación:** `.gitignore` le dice a Git qué **no** versionar: `node_modules` (se reinstala con `npm install`), `.env` (puede tener secretos) y `dist` (se genera). `!.env.example` crea una excepción: la plantilla **sí** se sube.
- **Resultado esperado:** `git status` no muestra `node_modules` ni `.env`.
- **Errores frecuentes:** crear `.gitignore` **después** de hacer commit de `node_modules`. Se corrige con `git rm -r --cached node_modules`.

### Paso 4 — Configuración centralizada

- **Archivo:** `env.ts`
- **Ruta:** `backend/src/config/env.ts`

```ts
import dotenv from 'dotenv';

// Lee el archivo .env y copia sus valores en process.env.
// quiet: true evita que dotenv imprima mensajes en la consola.
dotenv.config({ quiet: true });

/**
 * Configuración de la aplicación en un solo lugar.
 * El resto del código importa `env` en lugar de leer process.env directamente.
 */
export const env = {
  port: Number(process.env.PORT) || 3000,
  // "http://localhost:5173,http://127.0.0.1:5173" -> ['http://localhost:5173', 'http://127.0.0.1:5173']
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origen) => origen.trim()),
};
```

- **Explicación:** `dotenv.config()` lee `.env`. `Number(process.env.PORT) || 3000` convierte el texto en número y usa 3000 si no hay valor. `split(',')` permite autorizar varios orígenes. El resto del código importa `env` y nunca lee `process.env` directamente.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** importar `env.ts` **después** de usar `process.env` en otro archivo. Por eso `env.ts` es lo primero que se lee.

### Paso 5 — Tipos del producto (compartidos con el frontend)

- **Archivo:** `producto.types.ts`
- **Ruta:** `backend/src/types/producto.types.ts`

```ts
/**
 * Categorías permitidas.
 * `as const` le dice a TypeScript que este arreglo no cambiará,
 * así puede usar sus valores exactos como tipo.
 */
export const CATEGORIAS = ['Electrónica', 'Papelería', 'Alimentos', 'Aseo', 'Hogar', 'Otros'] as const;

/** Tipo unión: 'Electrónica' | 'Papelería' | 'Alimentos' | 'Aseo' | 'Hogar' | 'Otros' */
export type Categoria = (typeof CATEGORIAS)[number];

/** Datos que envía el cliente para crear o actualizar un producto. */
export interface ProductoDatos {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: Categoria;
  precio: number;
  stock: number;
}

/** Producto completo, tal como lo devuelve la API. */
export interface Producto extends ProductoDatos {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
```

- **Explicación:** es la misma forma que en el frontend, con una diferencia: aquí `createdAt` es `Date`, porque en el servidor trabajamos con fechas reales; al viajar como JSON se convierten en texto. Frontend y backend son proyectos separados y cada uno declara sus tipos.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** ninguno relevante.

### Paso 6 — Datos en memoria

- **Archivo:** `productos.data.ts`
- **Ruta:** `backend/src/data/productos.data.ts`

```ts
import { randomUUID } from 'node:crypto';
import type { Producto } from '../types/producto.types';

/**
 * Datos en memoria (sesiones 4 a 6).
 * Viven mientras el servidor está encendido: si lo reinicias, vuelven a este estado.
 * En la sesión 7 los reemplazamos por MongoDB.
 */
export const productosIniciales: Producto[] = [
  {
    id: randomUUID(),
    codigo: 'ELE-001',
    nombre: 'Audífonos inalámbricos',
    descripcion: 'Bluetooth 5.3, estuche de carga',
    categoria: 'Electrónica',
    precio: 89900,
    stock: 12,
    createdAt: new Date('2026-01-10T10:00:00Z'),
    updatedAt: new Date('2026-01-10T10:00:00Z'),
  },
  {
    id: randomUUID(),
    codigo: 'ELE-002',
    nombre: 'Cable USB-C 1 m',
    descripcion: 'Carga rápida 60 W',
    categoria: 'Electrónica',
    precio: 15900,
    stock: 3,
    createdAt: new Date('2026-01-10T10:05:00Z'),
    updatedAt: new Date('2026-01-10T10:05:00Z'),
  },
  {
    id: randomUUID(),
    codigo: 'PAP-001',
    nombre: 'Cuaderno cuadriculado 100 hojas',
    descripcion: 'Tamaño carta, tapa dura',
    categoria: 'Papelería',
    precio: 7500,
    stock: 40,
    createdAt: new Date('2026-01-11T09:00:00Z'),
    updatedAt: new Date('2026-01-11T09:00:00Z'),
  },
  {
    id: randomUUID(),
    codigo: 'PAP-002',
    nombre: 'Esfero negro',
    descripcion: '',
    categoria: 'Papelería',
    precio: 1200,
    stock: 0,
    createdAt: new Date('2026-01-11T09:10:00Z'),
    updatedAt: new Date('2026-01-11T09:10:00Z'),
  },
  {
    id: randomUUID(),
    codigo: 'ALI-001',
    nombre: 'Café molido 500 g',
    descripcion: 'Origen Huila, tostión media',
    categoria: 'Alimentos',
    precio: 24500,
    stock: 18,
    createdAt: new Date('2026-01-12T08:30:00Z'),
    updatedAt: new Date('2026-01-12T08:30:00Z'),
  },
  {
    id: randomUUID(),
    codigo: 'ASE-001',
    nombre: 'Jabón líquido de manos',
    descripcion: 'Presentación de 1 litro',
    categoria: 'Aseo',
    precio: 11900,
    stock: 5,
    createdAt: new Date('2026-01-12T08:45:00Z'),
    updatedAt: new Date('2026-01-12T08:45:00Z'),
  },
];
```

- **Explicación:** `randomUUID()` (módulo `node:crypto`, incluido en Node) genera ids únicos. Estos datos viven **en la memoria del servidor**: todos los clientes ven los mismos, pero se reinician cuando se apaga el servidor.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** escribir fechas como texto (`createdAt: '2026-01-10'`) → error de tipo, porque se espera `Date`.

### Paso 7 — Middleware de registro de peticiones

- **Archivo:** `registrarPeticiones.ts`
- **Ruta:** `backend/src/middlewares/registrarPeticiones.ts`

```ts
import type { NextFunction, Request, Response } from 'express';

/**
 * Middleware de registro (logger).
 * Imprime en consola cada petición: método, URL, código de respuesta y duración.
 * Ejemplo:  POST /api/productos -> 201 (12 ms)
 */
export function registrarPeticiones(req: Request, res: Response, next: NextFunction) {
  const inicio = Date.now();

  // 'finish' se dispara cuando la respuesta ya se envió al cliente.
  res.on('finish', () => {
    const duracion = Date.now() - inicio;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${duracion} ms)`);
  });

  next(); // pasa el control al siguiente middleware o ruta
}
```

- **Explicación:** es nuestro primer middleware propio. Anota la hora de inicio, se suscribe al evento `finish` de la respuesta para medir la duración y **llama a `next()`** para continuar la cadena.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** olvidar `next()` → todas las peticiones quedan "cargando" para siempre.

### Paso 8 — Respuestas 404 y 500 en JSON

- **Archivo:** `manejarErrores.ts`
- **Ruta:** `backend/src/middlewares/manejarErrores.ts`

```ts
import type { NextFunction, Request, Response } from 'express';

/**
 * Se ejecuta cuando ninguna ruta coincidió con la petición.
 * Debe registrarse DESPUÉS de todas las rutas.
 */
export function rutaNoEncontrada(req: Request, res: Response) {
  res.status(404).json({ mensaje: `La ruta ${req.method} ${req.originalUrl} no existe` });
}

/**
 * Middleware de manejo de errores (tiene 4 parámetros: err, req, res, next).
 * Express lo reconoce por tener exactamente 4 parámetros.
 * Debe registrarse al FINAL de app.ts.
 */
export function manejarErrores(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  // JSON mal escrito en el cuerpo de la petición (lo detecta express.json)
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
    return;
  }

  // Cualquier otro error: no mostramos detalles internos al cliente.
  console.error('[Error no controlado]', error);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
}
```

- **Explicación:** `rutaNoEncontrada` se ejecuta si ninguna ruta respondió. `manejarErrores` tiene **cuatro parámetros**: así Express sabe que es un manejador de errores. Distingue el JSON mal escrito (400) de cualquier otro error (500). Nunca envía al cliente el detalle técnico: solo lo registra en la consola del servidor (**seguridad**).
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** quitar `_next` porque "no se usa" → Express deja de reconocerlo como manejador de errores.

### Paso 9 — Configurar la aplicación Express

- **Archivo:** `app.ts`
- **Ruta:** `backend/src/app.ts`

```ts
import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { productosIniciales } from './data/productos.data';
import { manejarErrores, rutaNoEncontrada } from './middlewares/manejarErrores';
import { registrarPeticiones } from './middlewares/registrarPeticiones';

/**
 * Configuración de la aplicación Express (versión de la sesión 4).
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
  res.status(200).json({ estado: 'ok', fecha: new Date().toISOString() });
});

app.get('/api/productos', (_req, res) => {
  res.status(200).json(productosIniciales);
});

// 5. Si ninguna ruta respondió: 404
app.use(rutaNoEncontrada);

// 6. Manejo centralizado de errores (siempre al final)
app.use(manejarErrores);
```

- **Explicación:** el orden de `app.use` define el orden de la cadena. Las rutas responden con `res.status(200).json(...)`. Las dos últimas líneas son la "red de seguridad": primero 404 y luego errores.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** registrar `rutaNoEncontrada` **antes** de las rutas → todo responde 404.

### Paso 10 — Encender el servidor

- **Archivo:** `server.ts`
- **Ruta:** `backend/src/server.ts`

```ts
import { app } from './app';
import { env } from './config/env';

/**
 * PUNTO DE ENTRADA DEL BACKEND (versión de la sesión 4)
 * Enciende el servidor HTTP en el puerto configurado.
 */
app.listen(env.port, () => {
  console.log(`[API] Servidor escuchando en http://localhost:${env.port}/api`);
});
```

- **Explicación:** `server.ts` solo **arranca**. Tener `app` separado permite, en la sesión 7, conectar primero la base de datos y luego escuchar.
- **Resultado esperado:** —
- **Errores frecuentes:** —

### Paso 11 — Ejecutar y probar

```bash
npm run dev
```

**Resultado esperado en la terminal:**

```
[API] Servidor escuchando en http://localhost:3000/api
```

**Pruebas** (en el navegador y en Thunder Client o REST Client):

| Petición | Resultado esperado |
|----------|--------------------|
| `GET http://localhost:3000/api/salud` | 200 `{ "estado": "ok", "fecha": "..." }` |
| `GET http://localhost:3000/api/productos` | 200 y un arreglo con 6 productos |
| `GET http://localhost:3000/api/clientes` | 404 `{ "mensaje": "La ruta GET /api/clientes no existe" }` |
| `POST http://localhost:3000/api/productos` con cuerpo `{ "codigo": ` (mal escrito) y `Content-Type: application/json` | 400 `{ "mensaje": "El cuerpo de la petición no es un JSON válido" }` |

En la terminal del backend aparece una línea por petición: `GET /api/productos -> 200 (2 ms)`.

- **Errores frecuentes:**
  - `EADDRINUSE: address already in use :::3000` → ya hay un servidor en ese puerto (quizá otra terminal). Cerrarlo o cambiar `PORT` en `.env`.
  - `Cannot find module 'express'` → falta `npm install` o se ejecutó en otra carpeta.
  - Cambios en `.env` que no se aplican → `tsx watch` no vigila `.env`: detener con `Ctrl + C` y volver a ejecutar.

---

## 8. Actividad práctica (parejas, 15 min)

1. Agregar la ruta `GET /api/categorias` que responda la lista `CATEGORIAS` (importarla de `types/producto.types.ts`).
2. **Experimento de CORS:** con el backend y el frontend encendidos, abrir `http://localhost:5173`, ir a la consola del navegador y ejecutar:
   ```js
   await (await fetch('http://localhost:3000/api/productos')).json()
   ```
   Funciona. Luego cambiar en `backend/.env` `CORS_ORIGIN=http://localhost:9999`, reiniciar el backend y repetir. Anotar el error que aparece en la consola y restaurar el valor.
3. Revisar en *Network* los encabezados de respuesta y encontrar `Access-Control-Allow-Origin`.

## 9. Reto

Hacer que `GET /api/productos` acepte un filtro opcional por categoría: `GET /api/productos?categoria=Papelería` debe devolver solo esos productos. Pista: `req.query.categoria` y `filter`. Si no se envía, devolver todos.

## 10. Preguntas de comprobación (con respuesta esperada)

1. **¿Qué es Node.js?** Un entorno para ejecutar JavaScript fuera del navegador.
2. **¿Qué es un middleware y qué pasa si no llama a `next()` ni responde?** Una función intermedia de la cadena de Express. Si no llama a `next()` ni responde, la petición queda sin respuesta.
3. **¿Por qué `manejarErrores` se registra al final?** Porque debe atrapar los errores de todo lo anterior; Express lo reconoce por sus 4 parámetros.
4. **¿Por qué en Thunder Client funciona sin CORS y en React no?** Porque CORS es una restricción del navegador; las herramientas de prueba no la aplican.
5. **¿Qué diferencia hay entre `dependencies` y `devDependencies`?** Las primeras se necesitan para ejecutar la app; las segundas solo para desarrollarla (compilador, tipos).
6. **¿Por qué `.env` no se sube a Git, pero `.env.example` sí?** `.env` puede contener secretos; `.env.example` solo documenta qué variables existen.

## 11. Evidencia de aprendizaje

- Captura de Thunder Client (o similar) con `GET /api/productos` → 200.
- Captura de la terminal del backend con al menos 4 líneas del middleware de registro (incluidos un 404 y un 400).
- Captura del error de CORS del experimento.
- Commit: `git commit -m "Sesión 4: API Express con TypeScript, middlewares y CORS"`.

## 12. Tarea (autónoma, ~1,5 h)

1. Completar el reto.
2. Leer la guía oficial de Express "Routing" y "Using middleware" (expressjs.com).
3. **Preparación para la sesión 5:** diseñar en papel qué debería responder la API (código y cuerpo) en estos casos: crear un producto sin nombre, consultar un id que no existe, crear un producto con un código que ya existe y eliminar un producto con éxito.
