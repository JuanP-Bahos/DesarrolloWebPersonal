# Sesión 5 — CRUD REST

> **Proyecto:** StockFácil · **Bloque:** Backend (2 de 3) · **Duración:** 120 minutos
> **Punto de partida:** API con `GET /api/salud` y `GET /api/productos` (sesión 4).
> **Al terminar la sesión:** la API tiene el **CRUD completo** (7 endpoints) organizado en **rutas → controladores → servicios**, con **validación**, **manejo centralizado de errores** y **códigos de estado** correctos, probado con Thunder Client, Postman o REST Client. Los datos siguen en memoria.

---

## 1. Objetivo de aprendizaje

Al finalizar la sesión, el estudiante será capaz de **implementar una API REST con CRUD completo usando una arquitectura por capas**, validando las entradas, manejando los errores de forma centralizada y verificando cada endpoint con una herramienta de pruebas HTTP.

## 2. Competencias

| Tipo | Competencia |
|------|-------------|
| Conceptual | Explica la responsabilidad de rutas, controladores, servicios y middlewares, y por qué se separan. |
| Conceptual | Elige el código de estado correcto para cada situación (200, 201, 204, 400, 404, 409, 500). |
| Procedimental | Implementa GET, GET por id, POST, PUT, PATCH y DELETE con `express.Router`. |
| Procedimental | Valida datos de entrada y lanza errores con un `HttpError` propio. |
| Procedimental | Prueba sistemáticamente una API: casos exitosos y casos de error. |
| Actitudinal | Desconfía de los datos del cliente y documenta las pruebas. |

## 3. Conceptos previos

- Sesión 4: Express, middlewares, `req`/`res`, códigos de estado.
- Sesión 3: métodos HTTP, PUT vs PATCH.
- JavaScript: `find`, `findIndex`, `splice`, `some`, `Object.assign`, clases y `throw`.

---

## 4. Teoría

### 4.1 Arquitectura por capas

- **Qué es:** organizar el código en **capas** con una responsabilidad cada una. Cada capa solo habla con la siguiente.
- **Para qué sirve:** para que un cambio en una parte no obligue a cambiar las demás.
- **Por qué se utiliza:** facilita leer, probar y mantener el código. **En la sesión 8 lo comprobaremos:** cambiaremos el arreglo en memoria por MongoDB tocando **solo** la capa de servicios.
- **Ejemplo sencillo** (el recorrido de `POST /api/productos`):
  ```
  routes/        → "POST / lo atiende: validarProductoCompleto y luego crearProducto"
  middlewares/   → "¿los datos son válidos?" (si no → 400)
  controllers/   → "leo req.body, llamo al servicio, respondo 201"
  services/      → "reviso que el código no se repita (si se repite → 409) y guardo"
  ```

| Capa | Conoce `req`/`res` | Conoce cómo se guardan los datos |
|------|:------------------:|:--------------------------------:|
| Rutas | No (solo las conecta) | No |
| Middlewares | Sí | No |
| Controladores | **Sí** | **No** |
| Servicios | **No** | **Sí** |

### 4.2 Routes (rutas con `express.Router`)

- **Qué es:** un `Router` es un "mini-app" de Express donde se agrupan las rutas de un recurso.
- **Para qué sirve:** para que `app.ts` no crezca sin control: cada recurso (productos, y en el futuro clientes o ventas) tiene su archivo.
- **Por qué se utiliza:** `app.use('/api/productos', productoRouter)` monta todas las rutas con ese prefijo. Dentro del router se escribe solo `/` o `/:id`.
- **Ejemplo sencillo:** `router.get('/:id', obtenerProducto)` atiende `GET /api/productos/abc` y deja `'abc'` en `req.params.id`.
- **Aplicación en el proyecto:** `routes/producto.routes.ts` declara los 6 endpoints de productos y los middlewares de cada uno.

### 4.3 Controllers (controladores)

- **Qué es:** funciones que traducen entre **HTTP** y la **lógica de negocio**: leen la petición, llaman al servicio y construyen la respuesta.
- **Para qué sirve:** para mantener la lógica de negocio libre de detalles HTTP.
- **Por qué se utiliza:** si mañana hubiera otra forma de acceder (un script o una cola de mensajes), los servicios se reutilizarían sin cambios.
- **Ejemplo sencillo:**
  ```ts
  export async function crearProducto(req: Request, res: Response) {
    const creado = await productoService.crearProducto(req.body);
    res.status(201).json(creado);
  }
  ```
- **Aplicación en el proyecto:** `controllers/producto.controller.ts`. Son **cortos a propósito**.

### 4.4 Services (servicios)

- **Qué es:** la capa con la **lógica de negocio** y el **acceso a datos**.
- **Para qué sirve:** es el único lugar que sabe *dónde* y *cómo* se guardan los productos, y qué reglas aplicar (por ejemplo, "el código no se repite").
- **Por qué se utiliza:** concentra las reglas en un solo lugar y aísla la fuente de datos.
- **Aplicación en el proyecto:** `services/producto.service.ts` trabaja hoy sobre un arreglo. Sus funciones son `async` aunque el arreglo responda al instante: así, cuando se cambie por MongoDB, los controladores no tendrán que cambiar.

### 4.5 Validación en el servidor

- **Qué es:** verificar que los datos recibidos cumplen las reglas **antes** de procesarlos.
- **Para qué sirve:** para proteger la integridad de los datos.
- **Por qué se utiliza:** **nunca confíes en el cliente.** Cualquiera puede enviar peticiones con Postman o `curl` sin pasar por el formulario de React. La validación del frontend es comodidad; la del backend es **seguridad**.
- **Ejemplo sencillo:** `if (typeof precio !== 'number' || precio < 0) errores.push('...')`
- **Detalles del proyecto:**
  - **POST y PUT** exigen todos los campos obligatorios; **PATCH** valida solo los que llegan.
  - **Lista blanca:** solo se aceptan los campos permitidos (`codigo`, `nombre`, ...). Si alguien envía `"id": "hack"` o `"createdAt"`, se ignoran.
  - Se devuelven **todos** los errores a la vez, no solo el primero, para que el usuario los corrija de una sola vez.

### 4.6 Manejo de errores

- **Qué es:** una estrategia para que **cualquier** error termine en una respuesta JSON coherente.
- **Para qué sirve:** para que el cliente siempre reciba `{ mensaje, errores? }` y un código de estado correcto.
- **Por qué se utiliza:** sin ella, habría `try/catch` repetidos en cada controlador y respuestas inconsistentes.
- **Cómo funciona en el proyecto:**
  1. Cualquier capa **lanza** un `HttpError(404, 'No existe...')`.
  2. Express 5 captura el error, incluso dentro de funciones `async`, y lo envía a `manejarErrores`.
  3. `manejarErrores` responde `res.status(error.status).json({ mensaje, errores })`.
- **Ejemplo sencillo:** `throw new HttpError(409, 'Ya existe un producto con el código ELE-001');`

### 4.7 Status codes en el CRUD

| Endpoint | Éxito | Posibles errores |
|----------|-------|------------------|
| `GET /api/productos` | 200 | — |
| `GET /api/productos/:id` | 200 | 404 |
| `POST /api/productos` | **201** | 400 (validación), 409 (código repetido) |
| `PUT /api/productos/:id` | 200 | 400, 404, 409 |
| `PATCH /api/productos/:id` | 200 | 400 (incluido el cuerpo vacío), 404, 409 |
| `DELETE /api/productos/:id` | **204** (sin cuerpo) | 404 |

- **400 vs 409:** 400 significa "tus datos están mal formados o incumplen reglas"; 409 significa "tus datos están bien, pero chocan con el estado actual" (el código ya existe).

### 4.8 Pruebas con Postman, Insomnia o Thunder Client

- **Qué es:** herramientas para enviar peticiones HTTP a mano y ver la respuesta completa.
- **Para qué sirve:** para probar el backend **sin** frontend y aislar dónde está un problema.
- **Por qué se utiliza:** si la API funciona en Postman y falla en React, el problema está en el frontend (o en CORS). Si falla en Postman, está en el backend.
- **Opciones:**

  | Herramienta | Ventaja |
  |-------------|---------|
  | **REST Client** (VS Code) | Las pruebas son un archivo `.http` que se versiona con el código |
  | **Thunder Client** (VS Code) | Interfaz gráfica dentro del editor |
  | **Postman / Insomnia** | Aplicaciones completas; permiten automatizar pruebas |

- **Aplicación en el proyecto:** `backend/pruebas/api.http` y `backend/pruebas/stockfacil.postman_collection.json`. La colección se puede importar en Postman, Insomnia o Thunder Client.

**Buenas prácticas que aparecen hoy:** arquitectura por capas, validación del lado del servidor con lista blanca, errores centralizados, códigos de estado semánticos y **pruebas documentadas** junto al código.

---

## 5. Distribución de los 120 minutos

| Tiempo | Actividad | Descripción |
|--------|-----------|-------------|
| 0 – 10 min | Introducción | Revisión de la tarea: "¿qué debería responder la API si...?" |
| 10 – 30 min | Teoría | Capas, router, controladores, servicios, validación, errores, status codes y herramientas de prueba. |
| 30 – 50 min | Demostración | `HttpError`, el servicio en memoria y el primer endpoint completo (`GET /:id`) atravesando las capas. |
| 50 – 90 min | Desarrollo guiado | Controladores, validación, rutas, manejo de errores y `app.ts`. |
| 90 – 110 min | Taller | Batería de pruebas (casos felices y de error) con la herramienta elegida. |
| 110 – 120 min | Cierre | Preguntas, evidencia y tarea. |

---

## 6. Libreto del docente

### 0 – 10 min · Introducción

- Pedir a 3 estudiantes que compartan sus respuestas de la tarea (qué debería responder la API en cada caso) y construir con ellas la tabla 4.7 en el tablero.
  > **Pregunta:** *"Si alguien crea un producto con un código que ya existe, ¿es un 400 o un 409?"* Promover el debate y cerrar con la explicación de 4.7.

### 10 – 30 min · Teoría

- **Capas (8 min):** analogía de un **banco**. La ventanilla (ruta) recibe; el guardia (middleware) revisa documentos; el cajero (controlador) atiende y entrega el comprobante; la bóveda y sus reglas (servicio) guardan el dinero. El cajero no necesita saber cómo está construida la bóveda.
  > **Pregunta:** *"Si el banco cambia la bóveda por una más moderna, ¿hay que capacitar de nuevo a los cajeros?"* No: esa es la ventaja de las capas (y lo haremos en la sesión 8 al cambiar el arreglo por MongoDB).
- **Validación (4 min):** demostrar en vivo, con Thunder Client, que se puede enviar un precio negativo a la API **sin** pasar por el formulario de React. *"¿Quién nos protege?"*
- **Errores centralizados (4 min):** dibujar el recorrido de un `throw` desde el servicio hasta `manejarErrores`.
- **Herramientas de prueba (4 min):** mostrar REST Client con `api.http`: una petición es solo texto.

### 30 – 50 min · Demostración

1. Crear `HttpError` (paso 1).
2. Crear el servicio (paso 2) y explicar `listarProductos` y `obtenerProductoPorId`.
3. Crear **solo** el controlador `obtenerProducto` y la ruta `GET /:id`, y probar un id existente (200) y uno inexistente (404).
   > **Pregunta:** *"¿Dónde se decidió el 404: en el controlador o en el servicio?"* En el servicio, que lanzó el error; `manejarErrores` lo convirtió en respuesta.

### 50 – 90 min · Desarrollo guiado

- Pasos 3 a 7.
- **Momento de interacción (paso 4):** revisar las reglas de validación comparándolas con las del frontend (sesión 2). *"¿Son iguales? ¿Por qué deben coincidir?"*
- **Momento de interacción (paso 5):** leer las rutas en voz alta como frases: *"PUT a /:id pasa primero por validarProductoCompleto y luego por reemplazarProducto"*.

### 90 – 110 min · Taller

Ejecutar **todas** las pruebas del paso 8 y completar la tabla de resultados. Quien termine, escribe 3 pruebas nuevas.

### 110 – 120 min · Cierre

> "La API está completa y probada. Pero el frontend todavía guarda los datos en su propio estado. **La próxima sesión los conectamos: React hablará con Express.**"

---

## 7. Desarrollo práctico

### Paso 1 — Clase `HttpError`

- **Archivo:** `HttpError.ts`
- **Ruta:** `backend/src/utils/HttpError.ts`

```ts
/**
 * Error con código de estado HTTP.
 *
 * Los servicios y middlewares lanzan un HttpError cuando algo sale mal
 * (por ejemplo: 404 si el producto no existe) y el middleware manejarErrores
 * lo convierte en una respuesta JSON: { mensaje, errores? }.
 */
export class HttpError extends Error {
  status: number;
  errores?: string[];

  constructor(status: number, mensaje: string, errores?: string[]) {
    super(mensaje);
    this.name = 'HttpError';
    this.status = status;
    this.errores = errores;
  }
}
```

- **Explicación:** extiende la clase `Error` de JavaScript y le agrega `status` (el código HTTP) y `errores` (lista opcional de detalles). Así, cualquier capa puede decir **qué** salió mal y **con qué código**.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** olvidar `super(mensaje)` → `error.message` queda vacío.

### Paso 2 — Servicio de productos (en memoria)

- **Archivo:** `producto.service.ts`
- **Ruta:** `backend/src/services/producto.service.ts`

```ts
import { randomUUID } from 'node:crypto';
import { productosIniciales } from '../data/productos.data';
import type { Producto, ProductoDatos } from '../types/producto.types';
import { HttpError } from '../utils/HttpError';

/**
 * CAPA DE SERVICIOS (versión en memoria: sesiones 5 y 6)
 * Contiene la lógica de negocio y el acceso a los datos.
 * No conoce `req` ni `res`: recibe datos simples y devuelve datos simples.
 *
 * Las funciones son async aunque el arreglo responde al instante:
 * así, cuando usemos MongoDB (que sí tarda), los controladores no tendrán que cambiar.
 */

// "Base de datos" temporal: un arreglo que vive mientras el servidor esté encendido.
const productos: Producto[] = [...productosIniciales];

/** Verifica que ningún OTRO producto use ya ese código. */
function verificarCodigoDisponible(codigo: string, idActual?: string): void {
  const existe = productos.some((producto) => producto.codigo === codigo && producto.id !== idActual);
  if (existe) {
    throw new HttpError(409, `Ya existe un producto con el código ${codigo}`);
  }
}

/** Lista todos los productos, del más reciente al más antiguo. */
export async function listarProductos(): Promise<Producto[]> {
  return [...productos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/** Busca un producto por su id. Lanza 404 si no existe. */
export async function obtenerProductoPorId(id: string): Promise<Producto> {
  const producto = productos.find((item) => item.id === id);
  if (!producto) {
    throw new HttpError(404, `No existe un producto con el id ${id}`);
  }
  return producto;
}

/** Crea un producto nuevo y le asigna un id único. */
export async function crearProducto(datos: ProductoDatos): Promise<Producto> {
  const codigo = datos.codigo.trim().toUpperCase();
  verificarCodigoDisponible(codigo);

  const ahora = new Date();
  const nuevoProducto: Producto = {
    id: randomUUID(),
    codigo,
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion?.trim() ?? '',
    categoria: datos.categoria,
    precio: datos.precio,
    stock: datos.stock,
    createdAt: ahora,
    updatedAt: ahora,
  };

  productos.push(nuevoProducto);
  return nuevoProducto;
}

/**
 * Actualiza un producto.
 * - PUT envía todos los campos (reemplazo completo).
 * - PATCH envía solo algunos campos (actualización parcial).
 */
export async function actualizarProducto(id: string, datos: Partial<ProductoDatos>): Promise<Producto> {
  const producto = await obtenerProductoPorId(id); // lanza 404 si no existe

  const cambios = { ...datos };
  if (cambios.codigo !== undefined) {
    cambios.codigo = cambios.codigo.trim().toUpperCase();
    verificarCodigoDisponible(cambios.codigo, id);
  }

  // Object.assign copia los cambios sobre el objeto existente.
  Object.assign(producto, cambios, { updatedAt: new Date() });
  return producto;
}

/** Elimina un producto. Lanza 404 si no existe. */
export async function eliminarProducto(id: string): Promise<void> {
  const indice = productos.findIndex((producto) => producto.id === id);
  if (indice === -1) {
    throw new HttpError(404, `No existe un producto con el id ${id}`);
  }
  productos.splice(indice, 1); // quita 1 elemento en esa posición
}
```

- **Explicación:**
  - `productos` es la "base de datos" temporal, una copia del arreglo inicial.
  - `verificarCodigoDisponible` implementa la regla de negocio del código único; al editar, excluye al propio producto (`idActual`).
  - `obtenerProductoPorId` lanza **404** si no encuentra el producto; `actualizarProducto` la **reutiliza**.
  - `Object.assign(producto, cambios, { updatedAt })` sirve para PUT (todos los campos) y para PATCH (algunos).
  - `splice(indice, 1)` elimina un elemento del arreglo en esa posición.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** comparar `producto.id === id` con un id numérico. Los ids son texto (UUID).

### Paso 3 — Controladores

- **Archivo:** `producto.controller.ts`
- **Ruta:** `backend/src/controllers/producto.controller.ts`

```ts
import type { Request, Response } from 'express';
import * as productoService from '../services/producto.service';

/**
 * CAPA DE CONTROLADORES
 * Cada función:
 *   1. lee lo que necesita de la petición (req.params, req.body),
 *   2. llama al servicio,
 *   3. responde con el código de estado y el JSON adecuados.
 *
 * Express 5 captura automáticamente los errores de las funciones async
 * y los envía al middleware manejarErrores, por eso no usamos try/catch aquí.
 */

type ParametrosConId = { id: string };

// GET /api/productos
export async function listarProductos(_req: Request, res: Response) {
  const productos = await productoService.listarProductos();
  res.status(200).json(productos);
}

// GET /api/productos/:id
export async function obtenerProducto(req: Request<ParametrosConId>, res: Response) {
  const producto = await productoService.obtenerProductoPorId(req.params.id);
  res.status(200).json(producto);
}

// POST /api/productos
export async function crearProducto(req: Request, res: Response) {
  const productoCreado = await productoService.crearProducto(req.body);
  res.status(201).json(productoCreado); // 201 Created
}

// PUT /api/productos/:id  (reemplazo completo)
export async function reemplazarProducto(req: Request<ParametrosConId>, res: Response) {
  const productoActualizado = await productoService.actualizarProducto(req.params.id, req.body);
  res.status(200).json(productoActualizado);
}

// PATCH /api/productos/:id  (actualización parcial)
export async function actualizarProductoParcial(req: Request<ParametrosConId>, res: Response) {
  const productoActualizado = await productoService.actualizarProducto(req.params.id, req.body);
  res.status(200).json(productoActualizado);
}

// DELETE /api/productos/:id
export async function eliminarProducto(req: Request<ParametrosConId>, res: Response) {
  await productoService.eliminarProducto(req.params.id);
  res.status(204).send(); // 204 No Content: éxito, sin cuerpo de respuesta
}
```

- **Explicación:**
  - `import * as productoService` agrupa las funciones del servicio bajo un nombre, lo que evita confundir `crearProducto` del controlador con `crearProducto` del servicio.
  - `Request<ParametrosConId>` le indica a TypeScript que `req.params.id` existe.
  - **No hay `try/catch`:** Express 5 envía automáticamente al manejador de errores cualquier error de una función `async`.
  - `res.status(204).send()` responde sin cuerpo.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** usar `res.json()` con 204 → el cuerpo se descarta y confunde. Con 204 se usa `send()`.

### Paso 4 — Middlewares de validación

- **Archivo:** `validarProducto.ts`
- **Ruta:** `backend/src/middlewares/validarProducto.ts`

```ts
import type { NextFunction, Request, Response } from 'express';
import { CATEGORIAS } from '../types/producto.types';
import { HttpError } from '../utils/HttpError';

/** Únicos campos que el cliente puede enviar (lista blanca). */
const CAMPOS_PERMITIDOS = ['codigo', 'nombre', 'descripcion', 'categoria', 'precio', 'stock'];

const PATRON_CODIGO = /^[A-Za-z0-9-]{3,20}$/;

/**
 * Revisa los datos de un producto y devuelve la lista de errores encontrados.
 * @param datos      cuerpo de la petición (req.body)
 * @param esParcial  true para PATCH: solo se validan los campos que llegaron
 */
function validarDatosProducto(datos: Record<string, unknown>, esParcial: boolean): string[] {
  const errores: string[] = [];

  // En PATCH solo validamos los campos enviados; en POST y PUT, todos.
  const debeValidar = (campo: string) => !esParcial || datos[campo] !== undefined;

  if (debeValidar('codigo')) {
    const codigo = datos.codigo;
    if (typeof codigo !== 'string' || !PATRON_CODIGO.test(codigo.trim())) {
      errores.push('El código es obligatorio: de 3 a 20 caracteres (letras, números o guiones)');
    }
  }

  if (debeValidar('nombre')) {
    const nombre = datos.nombre;
    if (typeof nombre !== 'string' || nombre.trim().length < 3 || nombre.trim().length > 80) {
      errores.push('El nombre es obligatorio y debe tener entre 3 y 80 caracteres');
    }
  }

  // La descripción es opcional incluso en POST y PUT.
  if (datos.descripcion !== undefined) {
    const descripcion = datos.descripcion;
    if (typeof descripcion !== 'string' || descripcion.length > 300) {
      errores.push('La descripción debe ser un texto de máximo 300 caracteres');
    }
  }

  if (debeValidar('categoria')) {
    const categoria = datos.categoria;
    if (typeof categoria !== 'string' || !(CATEGORIAS as readonly string[]).includes(categoria)) {
      errores.push(`La categoría es obligatoria y debe ser una de: ${CATEGORIAS.join(', ')}`);
    }
  }

  if (debeValidar('precio')) {
    const precio = datos.precio;
    if (typeof precio !== 'number' || !Number.isFinite(precio) || precio < 0) {
      errores.push('El precio es obligatorio y debe ser un número mayor o igual a 0');
    }
  }

  if (debeValidar('stock')) {
    const stock = datos.stock;
    if (typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0) {
      errores.push('El stock es obligatorio y debe ser un número entero mayor o igual a 0');
    }
  }

  return errores;
}

/** Copia solo los campos permitidos; ignora cualquier otro (por ejemplo "id" o "createdAt"). */
function tomarCamposPermitidos(datos: Record<string, unknown>): Record<string, unknown> {
  const limpio: Record<string, unknown> = {};
  for (const campo of CAMPOS_PERMITIDOS) {
    if (datos[campo] !== undefined) {
      limpio[campo] = datos[campo];
    }
  }
  return limpio;
}

/** Lógica común de los dos middlewares de validación. */
function validar(req: Request, esParcial: boolean): void {
  const cuerpo: unknown = req.body;

  if (typeof cuerpo !== 'object' || cuerpo === null || Array.isArray(cuerpo)) {
    throw new HttpError(400, 'El cuerpo de la petición debe ser un objeto JSON');
  }

  const datos = tomarCamposPermitidos(cuerpo as Record<string, unknown>);

  if (esParcial && Object.keys(datos).length === 0) {
    throw new HttpError(400, 'Envía al menos un campo para actualizar', [
      `Campos permitidos: ${CAMPOS_PERMITIDOS.join(', ')}`,
    ]);
  }

  const errores = validarDatosProducto(datos, esParcial);
  if (errores.length > 0) {
    throw new HttpError(400, 'Los datos del producto no son válidos', errores);
  }

  req.body = datos; // el controlador recibe solo datos limpios
}

/** Para POST y PUT: todos los campos obligatorios deben venir. */
export function validarProductoCompleto(req: Request, _res: Response, next: NextFunction) {
  validar(req, false);
  next();
}

/** Para PATCH: se validan únicamente los campos enviados. */
export function validarProductoParcial(req: Request, _res: Response, next: NextFunction) {
  validar(req, true);
  next();
}
```

- **Explicación:**
  - `validarDatosProducto` devuelve una **lista** de errores; en modo parcial (PATCH) solo revisa los campos presentes.
  - `tomarCamposPermitidos` aplica la **lista blanca**.
  - `validar` rechaza cuerpos que no son objetos (por ejemplo `[]`, `"texto"` o ningún cuerpo) y un PATCH vacío.
  - Si todo está bien, reemplaza `req.body` por los datos limpios y llama a `next()`. Si no, **lanza** un `HttpError(400)` con todos los errores.
  - `typeof precio !== 'number'` rechaza `"5900"` (texto): la API exige tipos correctos.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** validar con `if (!datos.stock)`, que rechaza el stock `0`, que es válido. Por eso se compara el tipo y el rango.

### Paso 5 — Rutas de productos

- **Archivo:** `producto.routes.ts`
- **Ruta:** `backend/src/routes/producto.routes.ts`

```ts
import { Router } from 'express';
import {
  actualizarProductoParcial,
  crearProducto,
  eliminarProducto,
  listarProductos,
  obtenerProducto,
  reemplazarProducto,
} from '../controllers/producto.controller';
import { validarProductoCompleto, validarProductoParcial } from '../middlewares/validarProducto';

/**
 * CAPA DE RUTAS
 * Asocia cada método HTTP + URL con los middlewares y el controlador que lo atienden.
 * Todas estas rutas quedan bajo el prefijo /api/productos (ver app.ts).
 */
export const productoRouter = Router();

productoRouter.get('/', listarProductos);
productoRouter.get('/:id', obtenerProducto);
productoRouter.post('/', validarProductoCompleto, crearProducto);
productoRouter.put('/:id', validarProductoCompleto, reemplazarProducto);
productoRouter.patch('/:id', validarProductoParcial, actualizarProductoParcial);
productoRouter.delete('/:id', eliminarProducto);
```

- **Explicación:** cada ruta puede tener **varios** manejadores en cadena: primero la validación y luego el controlador. Leída en voz alta, la API se entiende de un vistazo.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** escribir `'/api/productos/:id'` dentro del router → la ruta final quedaría `/api/productos/api/productos/:id`.

### Paso 6 — Manejo centralizado de errores

- **Archivo:** `manejarErrores.ts` (reemplaza la versión de la sesión 4)
- **Ruta:** `backend/src/middlewares/manejarErrores.ts`

```ts
import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/HttpError';

/**
 * Se ejecuta cuando ninguna ruta coincidió con la petición.
 * Debe registrarse DESPUÉS de todas las rutas.
 */
export function rutaNoEncontrada(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, `La ruta ${req.method} ${req.originalUrl} no existe`));
}

/**
 * Middleware de manejo de errores (tiene 4 parámetros: err, req, res, next).
 * Convierte cualquier error en una respuesta JSON con el formato:
 *   { "mensaje": "...", "errores": ["..."] }
 * Debe registrarse al FINAL de app.ts.
 */
export function manejarErrores(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  // 1. Errores que lanzamos nosotros (404, 400, ...)
  if (error instanceof HttpError) {
    res.status(error.status).json({ mensaje: error.message, errores: error.errores });
    return;
  }

  // 2. JSON mal escrito en el cuerpo de la petición (lo detecta express.json)
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
    return;
  }

  // 3. Cualquier otro error: no mostramos detalles internos al cliente.
  console.error('[Error no controlado]', error);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
}
```

- **Explicación:** ahora `rutaNoEncontrada` también **lanza** un `HttpError` (con `next(error)`), así que todas las respuestas de error salen de un único lugar. El primer caso atiende nuestros `HttpError` con su código y detalles.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** ninguno relevante.

### Paso 7 — Montar el router en `app.ts`

- **Archivo:** `app.ts` (reemplaza la versión de la sesión 4)
- **Ruta:** `backend/src/app.ts`

```ts
import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { manejarErrores, rutaNoEncontrada } from './middlewares/manejarErrores';
import { registrarPeticiones } from './middlewares/registrarPeticiones';
import { productoRouter } from './routes/producto.routes';

/**
 * Configuración de la aplicación Express.
 * El ORDEN importa: cada petición pasa por los middlewares de arriba hacia abajo.
 */
export const app = express();

// 1. CORS: permite que el frontend (otro origen: localhost:5173) consuma la API.
app.use(cors({ origin: env.corsOrigins }));

// 2. Convierte el cuerpo JSON de la petición en un objeto disponible en req.body.
app.use(express.json());

// 3. Muestra en consola cada petición recibida.
app.use(registrarPeticiones);

// 4. Rutas
app.get('/api/salud', (_req, res) => {
  res.status(200).json({ estado: 'ok', fecha: new Date().toISOString() });
});

app.use('/api/productos', productoRouter);

// 5. Si ninguna ruta respondió: 404
app.use(rutaNoEncontrada);

// 6. Manejo centralizado de errores (siempre al final)
app.use(manejarErrores);
```

- **Explicación:** la ruta `GET /api/productos` que estaba escrita directamente aquí desaparece: ahora vive en el router. `app.ts` solo **configura y conecta**.
- **Resultado esperado:** `npm run dev` arranca sin errores.
- **Errores frecuentes:** dejar también la ruta antigua `app.get('/api/productos', ...)` → responde la primera que coincida, y el router nunca se ejecuta para ese caso.

### Paso 8 — Batería de pruebas

- **Archivo:** `api.http`
- **Ruta:** `backend/pruebas/api.http`

```http
### ───────────────────────────────────────────────────────────────
### Pruebas de la API de StockFácil
### Úsalas con la extensión "REST Client" de VS Code:
###   haz clic en "Send Request" encima de cada petición.
### También puedes importar pruebas/stockfacil.postman_collection.json
### en Postman, Insomnia o Thunder Client.
### ───────────────────────────────────────────────────────────────

@api = http://localhost:3000/api

### 1. Estado del servidor  → 200
GET {{api}}/salud

### 2. Listar productos  → 200
GET {{api}}/productos

### 3. Crear producto  → 201
# @name crear
POST {{api}}/productos
Content-Type: application/json

{
  "codigo": "HOG-001",
  "nombre": "Bombillo LED 9 W",
  "descripcion": "Luz blanca, rosca E27",
  "categoria": "Hogar",
  "precio": 6500,
  "stock": 25
}

### Guarda el id del producto creado (REST Client lo toma de la respuesta anterior)
@id = {{crear.response.body.id}}

### 4. Obtener producto por id  → 200
GET {{api}}/productos/{{id}}

### 5. Reemplazar producto (PUT: todos los campos)  → 200
PUT {{api}}/productos/{{id}}
Content-Type: application/json

{
  "codigo": "HOG-001",
  "nombre": "Bombillo LED 12 W",
  "descripcion": "Luz cálida, rosca E27",
  "categoria": "Hogar",
  "precio": 8200,
  "stock": 20
}

### 6. Actualizar solo el stock (PATCH: campos parciales)  → 200
PATCH {{api}}/productos/{{id}}
Content-Type: application/json

{
  "stock": 19
}

### 7. Eliminar producto  → 204
DELETE {{api}}/productos/{{id}}

### ─────────────── CASOS DE ERROR ───────────────

### 8. Datos inválidos  → 400 con lista de errores
POST {{api}}/productos
Content-Type: application/json

{
  "codigo": "X",
  "nombre": "ab",
  "categoria": "Ropa",
  "precio": -100,
  "stock": 2.5
}

### 9. Código repetido  → 409 (ejecuta primero `npm run seed`)
POST {{api}}/productos
Content-Type: application/json

{
  "codigo": "ELE-001",
  "nombre": "Producto duplicado",
  "categoria": "Electrónica",
  "precio": 1000,
  "stock": 1
}

### 10. Id con formato inválido  → 400
GET {{api}}/productos/123

### 11. Id válido que no existe  → 404
GET {{api}}/productos/66f000000000000000000000

### 12. PATCH sin campos  → 400
PATCH {{api}}/productos/66f000000000000000000000
Content-Type: application/json

{}

### 13. JSON mal escrito  → 400
POST {{api}}/productos
Content-Type: application/json

{ "codigo": "ABC-1", }

### 14. Ruta que no existe  → 404
GET {{api}}/clientes
```

> **Nota para esta sesión:** los ids todavía son UUID. Por eso la prueba 10 (`/productos/123`) responde **404** en lugar de 400, y la 11 también da 404. En la sesión 8, con MongoDB, agregaremos la validación del formato del id (400).

**Tabla de resultados que debe completar cada estudiante:**

| # | Prueba | Esperado | Obtenido | ✔ |
|---|--------|----------|----------|---|
| 1 | GET /salud | 200 | | |
| 2 | GET /productos | 200, 6 productos | | |
| 3 | POST válido | 201, código en MAYÚSCULAS, con `id` | | |
| 4 | GET /productos/{id} | 200 | | |
| 5 | PUT completo | 200, datos cambiados, `updatedAt` nuevo | | |
| 6 | PATCH `{ "stock": 19 }` | 200, solo cambió el stock | | |
| 7 | DELETE | 204, sin cuerpo | | |
| 8 | POST inválido | 400 con **5** errores | | |
| 9 | POST con código `ELE-001` | 409 | | |
| 10 | GET /productos/123 | 404 (hoy) | | |
| 11 | GET /productos/66f000000000000000000000 | 404 | | |
| 12 | PATCH `{}` | 400 | | |
| 13 | JSON mal escrito | 400 | | |
| 14 | GET /clientes | 404 | | |
| 15 | Repetir el DELETE del paso 7 | 404 | | |
| 16 | POST con campo extra `"id": "x"` | 201, se ignora el `id` enviado | | |

- **Errores frecuentes al probar:**
  - Olvidar el encabezado `Content-Type: application/json` → `express.json()` no lee el cuerpo y el resultado es 400 *"El cuerpo de la petición debe ser un objeto JSON"*.
  - Usar el id de una ejecución anterior: los ids en memoria cambian cada vez que se reinicia el servidor.

---

## 8. Actividad práctica (parejas, 15 min)

1. Completar la tabla del paso 8.
2. Importar `pruebas/stockfacil.postman_collection.json` en Postman o Thunder Client y ejecutar la colección completa (*Run collection*). Ojo: el caso *Id con formato inválido (400)* fallará hasta la sesión 8.
3. Reiniciar el servidor y ejecutar `GET /productos`. ¿Qué pasó con el producto creado? Escribir la conclusión.

## 9. Reto

Agregar el endpoint `GET /api/productos/resumen` que responda `{ totalProductos, totalUnidades, valorInventario, productosConStockBajo }`, con la lógica en el servicio. **Cuidado con el orden de las rutas:** debe registrarse **antes** de `/:id`. ¿Por qué? Porque si no, Express interpreta `resumen` como un id.

## 10. Preguntas de comprobación (con respuesta esperada)

1. **¿Qué responsabilidad tiene un controlador y cuál un servicio?** El controlador traduce HTTP (lee `req`, responde con `res`); el servicio aplica las reglas de negocio y accede a los datos.
2. **¿Por qué las funciones del servicio son `async` si el arreglo responde al instante?** Para que la interfaz no cambie cuando usemos una base de datos, que sí es asíncrona.
3. **¿Qué código devuelve un POST exitoso? ¿Y un DELETE?** 201 Created y 204 No Content.
4. **¿Cuándo 400 y cuándo 409?** 400 para datos inválidos; 409 cuando los datos son válidos pero entran en conflicto con el estado (código repetido).
5. **¿Qué hace la lista blanca de campos?** Descarta cualquier campo no permitido que envíe el cliente, como `id` o `createdAt`.
6. **¿Por qué no hay `try/catch` en los controladores?** Express 5 captura los errores de las funciones async y los envía a `manejarErrores`.

## 11. Evidencia de aprendizaje

- Tabla de resultados del paso 8 completa, con capturas de al menos 3 casos de error.
- Diagrama propio (a mano o digital) del recorrido de un `PUT` con datos inválidos a través de las capas.
- Commit: `git commit -m "Sesión 5: CRUD REST por capas con validación y errores"`.

## 12. Tarea (autónoma, ~1,5 h)

1. Completar el reto.
2. Escribir en `pruebas/api.http` dos pruebas nuevas: un PATCH que cambie el código a uno existente (409) y un PUT sin el campo `categoria` (400).
3. **Preparación para la sesión 6:** repasar el servicio del frontend (`productoService.ts`) y comparar cada función con el endpoint correspondiente de la API. ¿Coinciden los métodos, las rutas y los cuerpos?
