# Sesión 8 — CRUD con persistencia

> **Proyecto:** StockFácil · **Bloque:** Persistencia (2 de 2) · **Duración:** 120 minutos
> **Punto de partida:** Express conectado a MongoDB; listar, obtener y crear ya son persistentes (sesión 7).
> **Al terminar la sesión:** **CRUD completo sobre MongoDB**, validación de ObjectId, errores de base de datos traducidos a 400/404/409, pruebas completas y la aplicación **funcionando de extremo a extremo**: React → Express → MongoDB.

---

## 1. Objetivo de aprendizaje

Al finalizar la sesión, el estudiante será capaz de **completar un CRUD persistente con Mongoose**, aplicando validaciones y manejo de errores propios de la base de datos, y de **demostrar y explicar el funcionamiento integral** de una aplicación Full Stack.

## 2. Competencias

| Tipo | Competencia |
|------|-------------|
| Conceptual | Explica las opciones `returnDocument` y `runValidators` y los errores `ValidationError`, `CastError` y `11000`. |
| Conceptual | Explica la validación en tres capas y por qué cada una es necesaria. |
| Procedimental | Implementa actualizar y eliminar con `findByIdAndUpdate` y `findByIdAndDelete`. |
| Procedimental | Traduce los errores de la base de datos en respuestas HTTP adecuadas desde un único middleware. |
| Procedimental | Ejecuta pruebas de API y pruebas de extremo a extremo, y verifica la persistencia. |
| Actitudinal | Sustenta técnicamente su trabajo y revisa la calidad del código antes de entregarlo. |

## 3. Conceptos previos

- Sesión 7: modelo, conexión, `find`, `findById`, `create`.
- Sesión 5: `HttpError`, `manejarErrores` y códigos de estado.
- Sesión 6: flujo completo React ↔ Express.

---

## 4. Teoría

### 4.1 Crear

- **Qué es:** insertar un documento nuevo: `Modelo.create(datos)`.
- **Para qué sirve:** es la "C" del CRUD (`POST /api/productos`).
- **Por qué así:** `create` ejecuta las validaciones del esquema, aplica las transformaciones (`trim`, `uppercase`) y los valores por defecto, y agrega `createdAt` y `updatedAt`.
- **Ejemplo sencillo:** `await ProductoModel.create({ codigo: 'x-1', nombre: 'Lápiz', ... })` guarda `codigo: 'X-1'`.
- **Aplicación en el proyecto:** `crearProducto` en el servicio (migrado en la sesión 7).

### 4.2 Consultar

- **Qué es:** `Modelo.find(filtro)` devuelve un **arreglo** (vacío si no hay coincidencias). `.sort()`, `.limit()` y `.skip()` ordenan y paginan.
- **Ejemplo sencillo:**
  ```ts
  ProductoModel.find();                                  // todos
  ProductoModel.find({ categoria: 'Aseo' });             // filtro por igualdad
  ProductoModel.find({ stock: { $lte: 5 } });            // stock <= 5
  ProductoModel.find().sort({ createdAt: -1 }).limit(10) // los 10 más recientes
  ```
- **Aplicación en el proyecto:** `listarProductos` (`GET /api/productos`).

### 4.3 Consultar por ID

- **Qué es:** `Modelo.findById(id)` devuelve **un** documento o `null`.
- **Detalle clave:** si `id` no tiene formato de ObjectId (por ejemplo `"123"`), Mongoose **no puede convertirlo** y lanza un `CastError`. Si tiene el formato correcto pero no existe, devuelve `null` → 404.
- **Aplicación en el proyecto:** el middleware `validarId` revisa el formato **antes** de consultar (400), y el servicio lanza 404 si el resultado es `null`.

### 4.4 Actualizar

- **Qué es:** `Modelo.findByIdAndUpdate(id, cambios, opciones)` busca, aplica los cambios y devuelve un documento.
- **Opciones importantes:**

  | Opción | Qué hace | Si se olvida |
  |--------|----------|--------------|
  | `returnDocument: 'after'` | Devuelve el documento **ya actualizado** | Devuelve la versión **anterior** y la interfaz muestra datos viejos |
  | `runValidators: true` | Aplica las validaciones del esquema también al actualizar | Se podrían guardar valores inválidos (stock negativo) |

- **PUT vs PATCH en el proyecto:** ambos usan la misma función del servicio. La diferencia está en la **validación de entrada**: PUT pasa por `validarProductoCompleto` (todos los campos obligatorios) y PATCH por `validarProductoParcial` (solo los campos enviados).
- **Aplicación en el proyecto:** `actualizarProducto` → `PUT` y `PATCH /api/productos/:id`.

### 4.5 Eliminar

- **Qué es:** `Modelo.findByIdAndDelete(id)` elimina y devuelve el documento eliminado, o `null` si no existía.
- **Ejemplo sencillo:** `const borrado = await ProductoModel.findByIdAndDelete(id); if (!borrado) → 404`.
- **Eliminación física vs lógica:** borrar el documento (física, lo que hacemos) o marcarlo como `activo: false` (lógica, conserva la historia). En sistemas reales con ventas asociadas se prefiere la lógica. Se propone como reto.
- **Aplicación en el proyecto:** `eliminarProducto` → `DELETE /api/productos/:id` → 204.

### 4.6 Validaciones en tres capas

```
┌─────────────────────┐   ┌──────────────────────────┐   ┌──────────────────────────┐
│ 1. React            │ → │ 2. Middleware Express    │ → │ 3. Esquema Mongoose      │
│ validarFormulario   │   │ validarProducto/validarId│   │ required, min, enum,     │
│ (experiencia)       │   │ (API ante cualquier      │   │ unique (integridad en la │
│                     │   │  cliente)                │   │  base de datos)          │
└─────────────────────┘   └──────────────────────────┘   └──────────────────────────┘
      Evita viajes            Rechaza con 400 y la          Última barrera: protege
      innecesarios            lista de errores              incluso de scripts
```

- **Unicidad del código:** solo la base de datos puede garantizarla (índice único), porque dos peticiones simultáneas podrían pasar una revisión previa hecha con `find`.

### 4.7 Manejo de errores de la base de datos

| Error | Cuándo ocurre | Respuesta |
|-------|---------------|-----------|
| `mongoose.Error.ValidationError` | Una regla del esquema no se cumple | **400** + lista de mensajes |
| `mongoose.Error.CastError` | Un valor no se puede convertir al tipo esperado (id mal formado) | **400** |
| Código **11000** (`E11000 duplicate key`) | Se viola un índice único (código repetido) | **409** |
| Conexión perdida u otro error | Imprevisto | **500** (detalle solo en el log del servidor) |

- **Por qué centralizado:** los servicios no necesitan `try/catch`. Cualquier error llega a `manejarErrores`, que lo traduce. Un solo lugar para mantener.

### 4.8 Integración completa

```
INTERFAZ (clic)
   ↓
REACT + TYPESCRIPT  ProductoFila → InventarioPage → productoService → solicitar()
   ↓  HTTP/JSON
API REST            PATCH /api/productos/66f1…  { "stock": 13 }
   ↓
EXPRESS             registrarPeticiones → cors → json → router
   ↓
MIDDLEWARES         validarId → validarProductoParcial
   ↓
CONTROLLERS         actualizarProductoParcial(req, res)
   ↓
SERVICES            actualizarProducto(id, { stock: 13 })
   ↓
MODELOS             ProductoModel.findByIdAndUpdate(..., { runValidators, returnDocument: 'after' })
   ↓
MONGODB             inventario_db.productos  → documento actualizado en disco
   ↑  (el camino de regreso: documento → toJSON → 200 JSON → setProductos → re-render)
```

**Buenas prácticas que se consolidan hoy:** arquitectura por capas verificada (el cambio de la fuente de datos no tocó controladores ni frontend), validación en profundidad, errores traducidos sin exponer detalles internos, pruebas documentadas y eliminación del código temporal.

---

## 5. Distribución de los 120 minutos

| Tiempo | Actividad | Descripción |
|--------|-----------|-------------|
| 0 – 10 min | Introducción | Revisión de la tarea: los errores 500 pendientes y su diagnóstico. |
| 10 – 25 min | Teoría | Operaciones CRUD de Mongoose, opciones de actualización, errores de la BD y validación en capas. |
| 25 – 40 min | Demostración | Migrar `actualizarProducto` y mostrar el efecto de olvidar `returnDocument` y `runValidators`. |
| 40 – 80 min | Desarrollo guiado | Eliminar, `validarId`, rutas, manejo de errores completo, limpieza y pruebas. |
| 80 – 110 min | Taller | Prueba de extremo a extremo, prueba de persistencia y revisión con la rúbrica. |
| 110 – 120 min | Cierre del curso | Recorrido completo, preguntas finales y próximos pasos. |

---

## 6. Libreto del docente

### 0 – 10 min · Introducción

> **Docente:** "La clase pasada quedaron tres cosas pendientes. ¿Cuáles eran?"

Construir la tabla del paso 9 de la sesión 7 con las respuestas de la clase. Leer juntos en la terminal un `CastError` y un `E11000`.

> **Pregunta:** *"¿Un id mal escrito es culpa del servidor (500) o del cliente (4xx)?"* Del cliente → 400. *"¿Y un código repetido?"* 409.

### 10 – 25 min · Teoría

- **Operaciones (5 min):** tabla de equivalencias en el tablero:

  | Arreglo en memoria (sesión 5) | Mongoose (sesión 8) |
  |-------------------------------|---------------------|
  | `productos.find(p => p.id === id)` | `ProductoModel.findById(id)` |
  | `productos.push(nuevo)` | `ProductoModel.create(datos)` |
  | `Object.assign(producto, cambios)` | `ProductoModel.findByIdAndUpdate(id, cambios, opciones)` |
  | `productos.splice(indice, 1)` | `ProductoModel.findByIdAndDelete(id)` |

- **Errores (5 min):** tabla 4.7.
- **Validación en capas (5 min):** diagrama 4.6.
  > **Pregunta:** *"Si ya validamos en el middleware, ¿por qué `runValidators`?"* Porque el esquema protege la base ante **cualquier** código que escriba en ella: si mañana alguien crea otro endpoint y olvida el middleware, la base sigue protegida.

### 25 – 40 min · Demostración

1. Escribir `actualizarProducto` **sin** opciones: `findByIdAndUpdate(id, datos)`.
2. Pulsar + en el frontend: el número **no cambia** en la tabla (la respuesta trae el documento anterior), aunque en Compass sí cambió.
   > **Pregunta:** *"¿Dónde está la verdad? ¿Qué nos devolvió el servidor?"* Revisar *Response* en *Network*.
3. Agregar `returnDocument: 'after'`: ahora se ve bien.
4. Con Thunder Client, enviar un PATCH con `{ "stock": -1 }` saltándose el middleware (comentar temporalmente `validarProductoParcial` en la ruta): se guarda un stock negativo. Agregar `runValidators: true` y repetir: 400. **Restaurar el middleware.**

### 40 – 80 min · Desarrollo guiado

- Pasos 1 a 6.
- **Momento de interacción (paso 3):** *"¿Por qué validar el formato del id en un middleware y no dejar que Mongoose lance el CastError?"* Ambas cosas funcionan (el manejador también atrapa el CastError), pero el middleware responde antes, sin consultar la base, y con un mensaje más claro.

### 80 – 110 min · Taller final

1. **Prueba de extremo a extremo** (paso 7).
2. **Prueba de persistencia:** crear y editar productos, detener **ambos** servidores, volver a encenderlos y comprobar que todo sigue ahí.
3. **Autoevaluación con la rúbrica** (`docs/RUBRICA.md`): cada pareja se califica y anota qué mejoraría.

### 110 – 120 min · Cierre del curso

Pedir a un estudiante voluntario que **explique en voz alta** el recorrido del diagrama 4.8 señalando los archivos en su pantalla. Cerrar con la pregunta: *"Si mañana les piden agregar clientes a StockFácil, ¿qué archivos crearían?"* (Tipo, modelo, servicio, controlador, rutas y montaje en `app.ts`; del lado del frontend: tipo, servicio, componentes y página. **Es el mismo patrón.**)

**Próximos pasos sugeridos:** autenticación con JWT, React Router, pruebas automatizadas (Vitest y Supertest), despliegue (Render o Railway + Atlas + Vercel o Netlify) y Docker.

---

## 7. Desarrollo práctico

### Paso 1 — Servicio 100 % sobre MongoDB

- **Archivo:** `producto.service.ts` (versión final)
- **Ruta:** `backend/src/services/producto.service.ts`

```ts
import { ProductoModel } from '../models/producto.model';
import type { ProductoDatos } from '../types/producto.types';
import { HttpError } from '../utils/HttpError';

/**
 * CAPA DE SERVICIOS
 * Contiene la lógica de negocio y el acceso a los datos.
 * No conoce `req` ni `res`: recibe datos simples y devuelve datos simples.
 *
 * En la sesión 5 este archivo guardaba los productos en un arreglo en memoria.
 * En la sesión 8 lo reescribimos con MongoDB SIN cambiar los controladores.
 */

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

/**
 * Actualiza un producto.
 * - PUT envía todos los campos (reemplazo completo).
 * - PATCH envía solo algunos campos (actualización parcial).
 * En ambos casos usamos findByIdAndUpdate.
 */
export async function actualizarProducto(id: string, datos: Partial<ProductoDatos>) {
  const producto = await ProductoModel.findByIdAndUpdate(id, datos, {
    returnDocument: 'after', // devuelve el documento YA actualizado
    runValidators: true, // aplica las reglas del esquema también al actualizar
  });
  if (!producto) {
    throw new HttpError(404, `No existe un producto con el id ${id}`);
  }
  return producto;
}

/** Elimina un producto. Lanza 404 si no existe. */
export async function eliminarProducto(id: string): Promise<void> {
  const producto = await ProductoModel.findByIdAndDelete(id);
  if (!producto) {
    throw new HttpError(404, `No existe un producto con el id ${id}`);
  }
}
```

- **Explicación:**
  - `actualizarProducto`: `returnDocument: 'after'` devuelve el documento actualizado y `runValidators: true` valida los cambios. Si el resultado es `null`, el id no existe → 404.
  - `eliminarProducto`: si `findByIdAndDelete` devuelve `null` → 404.
  - Ya no hay arreglo en memoria ni verificación manual del código repetido: la unicidad la garantiza el **índice único** y el error 11000 se traduce en el paso 4.
  - **Ningún controlador cambió.** Compararlo con la versión de la sesión 5.
- **Resultado esperado:** editar, ajustar stock y eliminar desde React funcionan.
- **Errores frecuentes:** usar la opción antigua `{ new: true }`. Todavía funciona, pero Mongoose 9 la marca como obsoleta (*deprecated*) en favor de `returnDocument: 'after'`.

### Paso 2 — Borrar los datos en memoria

```bash
# dentro de backend/
rm -r src/data
```

- **Explicación:** ya nadie importa `productos.data.ts`. Los datos de ejemplo viven ahora en `scripts/seed.ts`.
- **Resultado esperado:** `npm run typecheck` sin errores.
- **Errores frecuentes:** si aparece `Cannot find module '../data/productos.data'`, queda alguna importación antigua; buscarla y quitarla.

### Paso 3 — Validar el formato del id

- **Archivo:** `validarId.ts`
- **Ruta:** `backend/src/middlewares/validarId.ts`

```ts
import type { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { HttpError } from '../utils/HttpError';

/**
 * Verifica que el parámetro :id tenga el formato de un ObjectId de MongoDB
 * (24 caracteres hexadecimales, por ejemplo 66f1a2b3c4d5e6f7a8b9c0d1).
 * Si no lo tiene, responde 400 sin llegar a consultar la base de datos.
 */
export function validarId(req: Request<{ id: string }>, _res: Response, next: NextFunction) {
  if (!isValidObjectId(req.params.id)) {
    throw new HttpError(400, `El id "${req.params.id}" no tiene un formato válido`);
  }
  next();
}
```

- **Explicación:** `isValidObjectId` (de Mongoose) comprueba el formato. Si no es válido, lanza un `HttpError(400)` **sin consultar** la base de datos.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** aplicarlo a `GET /` o a `POST /`, que no tienen `:id` → todas las peticiones responden 400.

### Paso 4 — Rutas con validación de id

- **Archivo:** `producto.routes.ts` (versión final)
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
import { validarId } from '../middlewares/validarId';
import { validarProductoCompleto, validarProductoParcial } from '../middlewares/validarProducto';

/**
 * CAPA DE RUTAS
 * Asocia cada método HTTP + URL con los middlewares y el controlador que lo atienden.
 * Todas estas rutas quedan bajo el prefijo /api/productos (ver app.ts).
 */
export const productoRouter = Router();

productoRouter.get('/', listarProductos);
productoRouter.get('/:id', validarId, obtenerProducto);
productoRouter.post('/', validarProductoCompleto, crearProducto);
productoRouter.put('/:id', validarId, validarProductoCompleto, reemplazarProducto);
productoRouter.patch('/:id', validarId, validarProductoParcial, actualizarProductoParcial);
productoRouter.delete('/:id', validarId, eliminarProducto);
```

- **Explicación:** `validarId` se agrega a las cuatro rutas con `:id` y se ejecuta **primero**: no tiene sentido validar el cuerpo si el id ya es inválido.
- **Resultado esperado:** `GET /api/productos/123` → 400.
- **Errores frecuentes:** ninguno relevante.

### Paso 5 — Manejo de errores completo

- **Archivo:** `manejarErrores.ts` (versión final)
- **Ruta:** `backend/src/middlewares/manejarErrores.ts`

```ts
import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { HttpError } from '../utils/HttpError';

/**
 * Se ejecuta cuando ninguna ruta coincidió con la petición.
 * Debe registrarse DESPUÉS de todas las rutas.
 */
export function rutaNoEncontrada(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, `La ruta ${req.method} ${req.originalUrl} no existe`));
}

/** Forma del error que lanza MongoDB cuando se repite un valor único. */
interface ErrorClaveDuplicada {
  code: number;
  keyValue?: Record<string, unknown>;
}

function esErrorClaveDuplicada(error: unknown): error is ErrorClaveDuplicada {
  return typeof error === 'object' && error !== null && (error as ErrorClaveDuplicada).code === 11000;
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

  // 3. Reglas del esquema de Mongoose que no se cumplen
  if (error instanceof mongoose.Error.ValidationError) {
    const errores = Object.values(error.errors).map((detalle) => detalle.message);
    res.status(400).json({ mensaje: 'Los datos del producto no son válidos', errores });
    return;
  }

  // 4. Un valor no se pudo convertir al tipo esperado (por ejemplo, un id mal formado)
  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({ mensaje: `El valor "${String(error.value)}" no es válido para ${error.path}` });
    return;
  }

  // 5. Índice único violado (código 11000): ya existe un producto con ese código
  if (esErrorClaveDuplicada(error)) {
    const codigo = error.keyValue?.codigo;
    const mensaje = codigo
      ? `Ya existe un producto con el código ${String(codigo)}`
      : 'Ya existe un producto con ese código';
    res.status(409).json({ mensaje });
    return;
  }

  // 6. Cualquier otro error: no mostramos detalles internos al cliente.
  console.error('[Error no controlado]', error);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
}
```

- **Explicación:**
  - Casos 3 y 4: `ValidationError` (se juntan los mensajes de cada campo) y `CastError`.
  - Caso 5: `esErrorClaveDuplicada` es un *type guard* (`error is ErrorClaveDuplicada`). Si devuelve `true`, TypeScript sabe que `error` tiene `code` y `keyValue`. MongoDB informa en `keyValue` el valor repetido: `{ codigo: 'ELE-001' }`.
  - El orden importa: primero los errores conocidos y al final el 500 genérico.
- **Resultado esperado:** crear `ELE-001` otra vez → **409** *Ya existe un producto con el código ELE-001*, y la alerta roja en React.
- **Errores frecuentes:** usar `error.code === 11000` sin verificar antes que `error` es un objeto. Con `unknown`, TypeScript obliga a comprobarlo (eso hace el *type guard*).

### Paso 6 — Pruebas completas de la API

- **Archivos:** `api.http` y `stockfacil.postman_collection.json`
- **Ruta:** `backend/pruebas/`

```bash
npm run seed      # datos conocidos antes de probar
```

Ejecutar **todas** las peticiones de `api.http` y la colección de Postman (*Run collection*): **15 aserciones, 0 fallidas**.

| Caso | Sesión 5 (memoria) | Sesión 8 (MongoDB) |
|------|--------------------|--------------------|
| `GET /productos/123` | 404 | **400** |
| `GET /productos/66f000000000000000000000` | 404 | 404 |
| Código repetido | 409 (lo verificaba el servicio) | 409 (índice único + error 11000) |
| Reiniciar el servidor | Se pierden los datos | **Se conservan** |

### Paso 7 — Prueba de extremo a extremo

Con **MongoDB, backend y frontend** encendidos, y Compass abierto:

| # | Acción en React | Verificar en *Network* | Verificar en Compass (*Refresh*) |
|---|-----------------|------------------------|----------------------------------|
| 1 | Abrir la app | GET 200, 6 productos | 6 documentos |
| 2 | Crear `hog-050` "Bombillo LED 9 W", stock 4 | POST 201, `codigo: "HOG-050"` | Nuevo documento con `_id` |
| 3 | Crear otra vez `HOG-050` | POST **409**, alerta roja | Sin cambios |
| 4 | Editar el nombre y el precio | PUT 200 | Campos cambiados y `updatedAt` nuevo |
| 5 | Pulsar + dos veces | 2 × PATCH 200 | `stock: 6` |
| 6 | Buscar "bomb" y filtrar por Hogar | (sin peticiones: el filtro es local) | — |
| 7 | Eliminar | DELETE **204** | El documento ya no existe |
| 8 | Detener backend y frontend, volver a encenderlos | GET 200 | Los datos siguen ahí |
| 9 | Detener **solo MongoDB** y pulsar + | Tras unos 10 s (Mongoose espera a que vuelva la conexión), PATCH **500** y alerta *Error interno del servidor* | — |

La prueba 9 muestra por qué `server.ts` se conecta **antes** de escuchar y por qué existe la respuesta genérica 500.

### Paso 8 (opcional) — Compilar para producción

```bash
# backend
npm run build && npm start        # ejecuta dist/server.js con Node puro

# frontend
npm run build && npm run preview  # sirve la versión optimizada de dist/
```

- **Explicación:** en producción no se usan `tsx` ni el servidor de desarrollo de Vite. Se compila una vez y se ejecuta el resultado.

---

## 8. Actividad práctica (parejas, 20 min)

1. Completar la tabla del paso 7 con capturas.
2. Revisar el proyecto contra la **lista de verificación final**:
   - [ ] `npm run build` pasa en frontend y backend.
   - [ ] `npm run lint` pasa en el frontend.
   - [ ] No hay `console.log` de depuración olvidados.
   - [ ] No existen `src/data/` ni `productos-demo.json`.
   - [ ] `.env` **no** está en Git (`git status` / `git ls-files | grep .env` solo muestra `.env.example`).
   - [ ] `README.md` explica cómo ejecutar el proyecto.
3. Autoevaluación con `docs/RUBRICA.md`.

## 9. Reto (elegir uno)

1. **Filtros en el servidor:** `GET /api/productos?categoria=Aseo&buscar=jab` usando `find` con `{ categoria }` y `{ nombre: { $regex: buscar, $options: 'i' } }`. Conectar la barra de filtros a la API.
2. **Paginación:** `GET /api/productos?pagina=2&limite=5` con `.skip()` y `.limit()`, devolviendo `{ datos, total, pagina }`.
3. **Eliminación lógica:** campo `activo: boolean` (por defecto `true`). DELETE lo pone en `false` y `find` solo devuelve los activos.
4. **Nuevo recurso:** CRUD de `proveedores` siguiendo exactamente el mismo patrón de capas.

## 10. Preguntas de comprobación (con respuesta esperada)

1. **¿Qué pasa si se omite `returnDocument: 'after'`?** La respuesta trae el documento anterior a la actualización y la interfaz muestra datos desactualizados.
2. **¿Para qué sirve `runValidators: true`?** Para que las validaciones del esquema también se apliquen en las actualizaciones.
3. **¿Qué respuesta produce cada error: ValidationError, CastError, 11000?** 400, 400 y 409.
4. **¿Por qué la unicidad del código se garantiza con un índice y no solo con un `find` previo?** Porque dos peticiones simultáneas podrían pasar la revisión a la vez; el índice lo garantiza la propia base de datos.
5. **¿Qué archivos cambiaron al pasar de memoria a MongoDB? ¿Cuáles no?** Cambiaron el servicio, la configuración, el modelo, `server.ts`, los middlewares de errores y de id, y las rutas. **No** cambiaron los controladores ni el frontend.
6. **Explica el recorrido completo de un PATCH de stock** (diagrama 4.8).

## 11. Evidencia de aprendizaje (entrega final)

- Repositorio con el proyecto completo (sin `node_modules` ni `.env`).
- Tabla de la prueba de extremo a extremo con capturas de *Network* y Compass.
- Resultado de la colección de Postman (15/15).
- Autoevaluación con la rúbrica.
- **Sustentación oral (5 minutos):** explicar el recorrido de una operación elegida por el docente señalando el código.
- Commit final: `git commit -m "Sesión 8: CRUD persistente con MongoDB, integración completa"`.

## 12. Tarea final

1. Implementar uno de los retos.
2. Escribir en el `README.md` una sección **"Qué aprendí"** con tres párrafos: frontend, backend y persistencia.
3. *(Opcional)* Desplegar la aplicación: backend en un servicio como Render o Railway con MongoDB Atlas, y frontend en Vercel o Netlify con `VITE_API_URL` apuntando al backend desplegado. Recordar actualizar `CORS_ORIGIN`.
