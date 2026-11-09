# Sesión 3 — Consumo de API

> **Proyecto:** StockFácil · **Bloque:** Frontend (3 de 3) · **Duración:** 120 minutos
> **Punto de partida:** CRUD en el estado de React (sesión 2).
> **Al terminar la sesión:** los productos **se cargan con `fetch`** desde un archivo JSON. La interfaz muestra los estados de **carga** y de **error**, y queda listo el **servicio HTTP** con las funciones GET, POST, PUT, PATCH y DELETE que se conectarán al backend en la sesión 6.

---

## 1. Objetivo de aprendizaje

Al finalizar la sesión, el estudiante será capaz de **explicar cómo se comunica un navegador con un servidor mediante HTTP/REST** y de **obtener datos de forma asíncrona en React** con `fetch`, `async/await` y `useEffect`, manejando los estados de carga y de error y usando variables de entorno.

## 2. Competencias

| Tipo | Competencia |
|------|-------------|
| Conceptual | Describe la estructura de una petición y una respuesta HTTP (método, URL, encabezados, cuerpo, código de estado). |
| Conceptual | Relaciona las operaciones CRUD con los métodos HTTP de una API REST. |
| Procedimental | Usa `fetch` con `async/await`, maneja errores con `try/catch` y convierte JSON. |
| Procedimental | Usa `useEffect` para cargar datos al montar un componente y muestra estados de carga y error. |
| Procedimental | Configura variables de entorno en Vite (`VITE_API_URL`). |
| Actitudinal | Diseña interfaces que informan al usuario lo que está pasando (cargando, error, reintentar). |

## 3. Conceptos previos

- Sesión 2: estado, eventos y CRUD local.
- JavaScript: Promesas, `async/await`, `try/catch/finally`, `JSON.stringify` y `JSON.parse`.
- Uso de las herramientas de desarrollador del navegador (F12).

---

## 4. Teoría

### 4.1 HTTP

- **Qué es:** el **protocolo** (conjunto de reglas) con el que el navegador y los servidores se comunican en la web. Funciona con **petición → respuesta**.
- **Para qué sirve:** para pedir y enviar recursos: páginas, imágenes o datos.
- **Por qué se utiliza:** es el estándar universal de la web; cualquier lenguaje y plataforma lo entiende.
- **Ejemplo sencillo** (lo que viaja realmente):
  ```http
  GET /api/productos HTTP/1.1          ← método + ruta
  Host: localhost:3000                 ← encabezados
  Accept: application/json

  HTTP/1.1 200 OK                      ← código de estado
  Content-Type: application/json

  [{"id":"1","nombre":"Cable USB-C"}]  ← cuerpo
  ```
- **Códigos de estado** (se profundizan en la sesión 4):

  | Rango | Significado | Ejemplos |
  |-------|-------------|----------|
  | 2xx | Éxito | 200 OK, 201 Created, 204 No Content |
  | 4xx | Error del **cliente** | 400 Bad Request, 404 Not Found, 409 Conflict |
  | 5xx | Error del **servidor** | 500 Internal Server Error |

- **Aplicación en el proyecto:** cada acción del usuario en StockFácil será una petición HTTP al backend.

### 4.2 REST

- **Qué es:** un **estilo de arquitectura** para diseñar APIs. Organiza la API alrededor de **recursos** (sustantivos) identificados por URLs, sobre los que se aplican **métodos HTTP** (verbos).
- **Para qué sirve:** para que las APIs sean predecibles: sabiendo el recurso, se deduce cómo usarla.
- **Por qué se utiliza:** es simple, usa HTTP tal como es y es el estilo más común en la industria.
- **Ejemplo sencillo:** ✅ `DELETE /api/productos/42` · ❌ `GET /api/borrarProducto?id=42`
- **Aplicación en el proyecto:** el recurso es `productos`. La API completa de StockFácil:

### 4.3 Métodos HTTP: GET, POST, PUT, PATCH y DELETE

| CRUD | Método | URL | Cuerpo enviado | Respuesta exitosa |
|------|--------|-----|----------------|-------------------|
| Leer todos | GET | `/api/productos` | — | 200 + arreglo |
| Leer uno | GET | `/api/productos/:id` | — | 200 + objeto |
| Crear | POST | `/api/productos` | Producto completo | 201 + objeto creado |
| Reemplazar | PUT | `/api/productos/:id` | Producto completo | 200 + objeto |
| Modificar parte | PATCH | `/api/productos/:id` | Solo campos a cambiar | 200 + objeto |
| Eliminar | DELETE | `/api/productos/:id` | — | 204 sin cuerpo |

- **PUT vs PATCH:** PUT **reemplaza** el recurso completo (se envían todos los campos). PATCH **modifica** solo lo enviado. En StockFácil: el formulario de edición usa PUT y los botones +/- usan PATCH `{ "stock": 13 }`.
- **Idempotencia:** repetir un GET, PUT o DELETE deja el servidor igual que hacerlo una vez. Repetir un POST crea duplicados.

### 4.4 JSON

- **Qué es:** *JavaScript Object Notation*, un formato de **texto** para representar datos.
- **Para qué sirve:** es el "idioma común" entre el frontend y el backend.
- **Por qué se utiliza:** es liviano, legible y cualquier lenguaje lo lee.
- **Ejemplo sencillo:**
  ```js
  JSON.stringify({ precio: 5900 })  // objeto → texto: '{"precio":5900}'
  JSON.parse('{"precio":5900}')     // texto → objeto
  ```
  Reglas: las llaves van entre comillas dobles, no hay funciones ni `undefined`, y las fechas viajan como texto (`"2026-01-10T10:00:00.000Z"`). Por eso `createdAt` es `string` en el tipo `Producto` del frontend.
- **Aplicación en el proyecto:** `body: JSON.stringify(datos)` al enviar y `await respuesta.json()` al recibir.

### 4.5 `fetch` (o Axios)

- **Qué es:** la función del navegador para hacer peticiones HTTP. Devuelve una **Promesa**.
- **Para qué sirve:** para pedir y enviar datos a un servidor desde JavaScript.
- **Por qué se utiliza (y no Axios):** `fetch` viene incluido en todos los navegadores y en Node.js, y no requiere instalar nada. Axios es una librería popular con algunas comodidades (convierte JSON automáticamente y lanza errores con 4xx/5xx). Para aprender, `fetch` muestra mejor lo que realmente ocurre.
- **Dos detalles importantes de `fetch`:**
  1. **No lanza error con 404 o 500.** Solo falla si **no hubo respuesta** (servidor apagado, sin red, CORS). Hay que revisar `respuesta.ok`.
  2. La respuesta llega en dos pasos: primero los encabezados (`await fetch(...)`) y luego el cuerpo (`await respuesta.json()`).
- **Ejemplo sencillo:**
  ```ts
  const respuesta = await fetch('/productos-demo.json');
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
  const productos = await respuesta.json();
  ```
- **Aplicación en el proyecto:** `services/api.ts` envuelve `fetch` en una función `solicitar()` que resuelve esos dos detalles una sola vez para toda la aplicación.

### 4.6 `async/await`

- **Qué es:** una sintaxis para escribir código asíncrono (que espera algo) **como si fuera secuencial**.
- **Para qué sirve:** para esperar la respuesta del servidor sin bloquear la página.
- **Por qué se utiliza:** es más legible que encadenar `.then().catch()`.
- **Ejemplo sencillo:**
  ```ts
  async function cargar() {
    try {
      const datos = await obtenerProductos(); // espera sin congelar la interfaz
      console.log(datos);
    } catch (error) {
      console.error('Falló:', error);
    } finally {
      console.log('Terminó (con éxito o con error)');
    }
  }
  ```
- **Aplicación en el proyecto:** todas las funciones del servicio y los manejadores de la página que llaman a la API.

### 4.7 `useEffect`

- **Qué es:** un *hook* de React para ejecutar código **después** de que el componente se dibuja. Ese código sincroniza el componente con algo externo: una API, un temporizador o el título de la pestaña.
- **Para qué sirve:** para cargar datos cuando la página aparece en pantalla.
- **Por qué se utiliza:** si hacemos `fetch` directamente en el cuerpo del componente, se ejecuta en **cada** render. Con `setProductos` eso provoca otro render, otro `fetch`... un ciclo infinito.
- **Anatomía:**
  ```tsx
  useEffect(() => {
    // 1. Efecto: se ejecuta después del render
    return () => { /* 2. Limpieza (opcional): antes de repetir o al desmontar */ };
  }, [dependencias]); // 3. Cuándo repetir: [] = solo al montar
  ```
- **StrictMode:** en desarrollo, React monta, desmonta y vuelve a montar cada componente para detectar efectos mal escritos. Por eso verás **dos** peticiones GET en *Network*. En producción ocurre una sola.
- **Aplicación en el proyecto:** `InventarioPage` carga los productos en un `useEffect` que depende de `intentoDeCarga`. Al pulsar **Reintentar**, ese número cambia y el efecto se repite.

### 4.8 Estados de carga y error

- **Qué es:** estados adicionales (`cargando`, `errorDeCarga`) que describen **en qué momento** está la petición.
- **Para qué sirve:** para que el usuario sepa qué ocurre: *cargando*, *falló (con motivo)* o *listo*.
- **Por qué se utiliza:** una red real tarda y a veces falla. Sin estos estados, la pantalla queda vacía y el usuario no sabe por qué.
- **Ejemplo sencillo:**
  ```
  cargando=true ──(respuesta OK)──→ cargando=false, productos=[...]
        └────────(error)──────────→ cargando=false, errorDeCarga="No se pudo..."
  ```
- **Aplicación en el proyecto:** el componente `Cargando` muestra un spinner, y el bloque `estado-error` muestra el mensaje con un botón **Reintentar**.

### 4.9 Variables de entorno

- **Qué es:** valores de configuración que se definen **fuera del código**, en un archivo `.env` o en el sistema.
- **Para qué sirve:** para que el mismo código funcione en distintos entornos (tu computador, el servidor de pruebas, producción) cambiando solo la configuración.
- **Por qué se utiliza:** evita escribir URLs o claves dentro del código ("*hardcodear*") y evita subir datos sensibles a Git.
- **En Vite:**
  - Solo las variables que empiezan por **`VITE_`** llegan al navegador.
  - Se leen con `import.meta.env.VITE_API_URL`.
  - **Hay que reiniciar** `npm run dev` después de modificar `.env`.
  - **Atención:** todo lo que se envía al navegador es **público**. **Nunca** pongas contraseñas en variables `VITE_`.
- **Aplicación en el proyecto:** `VITE_API_URL=http://localhost:3000/api`. Se versiona `.env.example` (la plantilla) y **no** `.env`.

**Buenas prácticas que aparecen hoy:** una **capa de servicios** en el frontend (los componentes no conocen URLs ni `fetch`), **variables de entorno** y **manejo de errores** centralizado en `solicitar()`.

---

## 5. Distribución de los 120 minutos

| Tiempo | Actividad | Descripción |
|--------|-----------|-------------|
| 0 – 10 min | Introducción | Repaso: "¿por qué se pierden los datos al recargar?". Presentación del modelo cliente-servidor. |
| 10 – 35 min | Teoría | HTTP, REST, métodos, JSON, fetch, async/await, useEffect, carga/error, variables de entorno. |
| 35 – 50 min | Demostración | Explorar peticiones reales en la pestaña *Network* y hacer un `fetch` en la consola. |
| 50 – 90 min | Desarrollo guiado | JSON de demostración, `useEffect`, `Cargando`, `.env`, `api.ts` y `productoService.ts`. |
| 90 – 110 min | Taller | Provocar y documentar errores; actividad práctica y reto. |
| 110 – 120 min | Cierre | Preguntas, evidencia y tarea. |

---

## 6. Libreto del docente

### 0 – 10 min · Introducción

> **Docente:** "La clase pasada terminamos con un problema: al recargar, los productos nuevos desaparecen. ¿Por qué?"

Respuesta esperada: el estado vive en la memoria de la pestaña. Dibujar:

```
 NAVEGADOR (cliente)                          SERVIDOR
 ┌────────────────┐   petición HTTP  →   ┌──────────────┐
 │ React (estado  │                      │ API + base   │
 │ temporal)      │   ← respuesta JSON   │ de datos     │
 └────────────────┘                      └──────────────┘
```

> "Para que los datos sobrevivan, deben vivir en un **servidor**. Hoy aprendemos a **hablar** con un servidor. En la sesión 4 construiremos el nuestro."

### 10 – 35 min · Teoría

- **HTTP (6 min):** analogía del restaurante. El **cliente** (tú) hace un **pedido** (petición) al **mesero** (HTTP), la **cocina** (servidor) prepara y el mesero trae el **plato** (respuesta) con una nota (código de estado): "200, aquí está"; "404, ese plato no existe"; "500, se quemó la cocina".
  > **Pregunta:** *"Si pido un producto con un id que no existe, ¿qué código esperan?"* (404.) *"¿Y si mando un precio negativo?"* (400.)
- **REST y métodos (7 min):** construir **con la clase** la tabla 4.3 en el tablero, preguntando: *"Para crear, ¿qué método usarían?"*, *"¿Qué debería responder un DELETE exitoso?"*
- **JSON (3 min):** `JSON.stringify` y `JSON.parse` en la consola.
- **fetch y async/await (5 min):** subrayar que **fetch no falla con 404**.
- **useEffect y variables de entorno (4 min):** explicar el ciclo infinito que ocurriría sin `useEffect`.

### 35 – 50 min · Demostración

1. Abrir cualquier sitio con F12 → **Network** → filtrar por **Fetch/XHR**. Hacer clic en una petición y recorrer: *Headers* (método, URL, status), *Payload* y *Response*.
2. En la consola del navegador, con el proyecto abierto en `localhost:5173`:
   ```js
   const r = await fetch('/favicon.svg'); console.log(r.status, r.ok, r.headers.get('content-type'));
   const r2 = await fetch('/no-existe.json'); console.log(r2.status, r2.ok);
   ```
   > **Pregunta:** *"¿El segundo fetch lanzó un error?"* No: `ok` es `false`, pero la promesa no falló. **Por eso siempre revisamos `ok`.**
3. *(Opcional, si hay internet)* Mostrar un POST real a una API pública de pruebas, como JSONPlaceholder, para ver un **201** en *Network*.

### 50 – 90 min · Desarrollo guiado

- Pasos 1 a 7.
- **Momento de interacción (paso 5):** preguntar: *"¿Por qué conviene que ningún componente llame a `fetch` directamente?"* (Un solo lugar para cambiar la URL, los encabezados y el manejo de errores; los componentes solo muestran.)
- **Momento de interacción (paso 6):** antes de escribir el `useEffect`, pedir que **predigan** qué pasaría si se llamara a `setProductos` directamente en el cuerpo del componente. Hacer la prueba unos segundos para ver el ciclo en *Network* y deshacerla.

### 90 – 110 min · Taller: "rompe y observa"

Parejas. Cada pareja provoca los errores de la tabla del paso 7, observa qué muestra la interfaz y qué aparece en *Network*, y lo anota.

### 110 – 120 min · Cierre

> "Ya tenemos todo el cliente listo para hablar con un servidor. Pero el servidor aún no existe: estamos leyendo un archivo. **La próxima sesión construimos el backend con Node.js y Express.**"

---

## 7. Desarrollo práctico

### Paso 1 — Archivo JSON de demostración

- **Archivo:** `productos-demo.json`
- **Ruta:** `frontend/public/productos-demo.json`

```json
[
  {
    "id": "1",
    "codigo": "ELE-001",
    "nombre": "Audífonos inalámbricos",
    "descripcion": "Bluetooth 5.3, estuche de carga",
    "categoria": "Electrónica",
    "precio": 89900,
    "stock": 12,
    "createdAt": "2026-01-10T10:00:00.000Z",
    "updatedAt": "2026-01-10T10:00:00.000Z"
  },
  {
    "id": "2",
    "codigo": "ELE-002",
    "nombre": "Cable USB-C 1 m",
    "descripcion": "Carga rápida 60 W",
    "categoria": "Electrónica",
    "precio": 15900,
    "stock": 3,
    "createdAt": "2026-01-10T10:05:00.000Z",
    "updatedAt": "2026-01-10T10:05:00.000Z"
  },
  {
    "id": "3",
    "codigo": "PAP-001",
    "nombre": "Cuaderno cuadriculado 100 hojas",
    "descripcion": "Tamaño carta, tapa dura",
    "categoria": "Papelería",
    "precio": 7500,
    "stock": 40,
    "createdAt": "2026-01-11T09:00:00.000Z",
    "updatedAt": "2026-01-11T09:00:00.000Z"
  },
  {
    "id": "4",
    "codigo": "PAP-002",
    "nombre": "Esfero negro",
    "descripcion": "",
    "categoria": "Papelería",
    "precio": 1200,
    "stock": 0,
    "createdAt": "2026-01-11T09:10:00.000Z",
    "updatedAt": "2026-01-11T09:10:00.000Z"
  },
  {
    "id": "5",
    "codigo": "ALI-001",
    "nombre": "Café molido 500 g",
    "descripcion": "Origen Huila, tostión media",
    "categoria": "Alimentos",
    "precio": 24500,
    "stock": 18,
    "createdAt": "2026-01-12T08:30:00.000Z",
    "updatedAt": "2026-01-12T08:30:00.000Z"
  },
  {
    "id": "6",
    "codigo": "ASE-001",
    "nombre": "Jabón líquido de manos",
    "descripcion": "Presentación de 1 litro",
    "categoria": "Aseo",
    "precio": 11900,
    "stock": 5,
    "createdAt": "2026-01-12T08:45:00.000Z",
    "updatedAt": "2026-01-12T08:45:00.000Z"
  }
]
```

- **Explicación:** todo lo que está en `public/` se sirve tal cual en la raíz del sitio. Este archivo estará en `http://localhost:5173/productos-demo.json` y simula la respuesta de un `GET /api/productos`. Son los mismos datos de `productosIniciales.ts`, ahora en formato JSON: comillas dobles y sin comas finales.
- **Resultado esperado:** al abrir esa URL en el navegador se ve el JSON.
- **Errores frecuentes:** una coma después del último elemento → `SyntaxError: Unexpected token ]` al convertir la respuesta.

### Paso 2 — Primer `fetch` (versión directa)

- **Archivo:** `productoService.ts` (primera versión, temporal)
- **Ruta:** `frontend/src/services/productoService.ts`

```ts
import type { Producto } from '../types/producto';

/**
 * TEMPORAL (sesión 3): lee un archivo JSON estático de la carpeta public/.
 * Nos permite practicar fetch antes de tener backend. Se elimina en la sesión 6.
 */
export async function obtenerProductosDemo(): Promise<Producto[]> {
  // Simulamos 1 segundo de espera para poder ver el estado "Cargando..."
  await new Promise((resolver) => setTimeout(resolver, 1000));

  const respuesta = await fetch('/productos-demo.json');
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}: no se pudo cargar el archivo de productos`);
  }
  return respuesta.json();
}
```

- **Explicación:** `async` hace que la función devuelva una Promesa. El `setTimeout` envuelto en una Promesa simula una red lenta. Si `ok` es falso, **lanzamos** un error para que quien llame se entere.
- **Resultado esperado:** sin errores en el editor.
- **Errores frecuentes:** olvidar `await` antes de `fetch`. Entonces `respuesta` es una Promesa, no una respuesta, y `respuesta.ok` es `undefined`.

### Paso 3 — Componente `Cargando`

- **Archivo:** `Cargando.tsx`
- **Ruta:** `frontend/src/components/Cargando.tsx`

```tsx
interface CargandoProps {
  texto?: string; // el signo ? indica que la prop es opcional
}

export function Cargando({ texto = 'Cargando...' }: CargandoProps) {
  return (
    <div className="cargando" role="status">
      <span className="cargando__spinner" aria-hidden="true" />
      <span>{texto}</span>
    </div>
  );
}
```

- **Explicación:** `texto?` es opcional y `texto = 'Cargando...'` le da un valor por defecto. El spinner es solo CSS (una animación `@keyframes girar`).
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** ninguno relevante.

### Paso 4 — Variables de entorno

- **Archivo:** `.env.example` (se versiona) y `.env` (copia local, **no** se versiona)
- **Ruta:** `frontend/.env.example` y `frontend/.env`

```bash
# ─────────────────────────────────────────────────────────────
# Variables de entorno del FRONTEND
# 1. Copia este archivo como .env   (cp .env.example .env)
# 2. Vite solo expone al navegador las variables que empiezan por VITE_
# 3. Si cambias este archivo, reinicia "npm run dev".
# ─────────────────────────────────────────────────────────────

# URL base de la API (backend)
VITE_API_URL=http://localhost:3000/api
```

```bash
# En la terminal, dentro de frontend/
cp .env.example .env        # Windows (PowerShell): Copy-Item .env.example .env
```

- **Archivo:** `vite-env.d.ts`
- **Ruta:** `frontend/src/vite-env.d.ts`

```ts
/// <reference types="vite/client" />

/**
 * Le decimos a TypeScript qué variables de entorno existen.
 * Así `import.meta.env.VITE_API_URL` tiene tipo y autocompletado.
 */
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- **Explicación:** `.env.example` documenta qué variables existen, sin valores secretos. `vite-env.d.ts` le dice a TypeScript que `VITE_API_URL` existe y es un `string`. Hay que agregar `.env` al `.gitignore`.
- **Resultado esperado:** en la consola del navegador, `import.meta.env` no está disponible directamente, pero un `console.log(import.meta.env.VITE_API_URL)` temporal en `main.tsx` muestra la URL. Después se borra.
- **Errores frecuentes:**
  - Nombrar la variable `API_URL` sin el prefijo `VITE_` → llega como `undefined`.
  - No reiniciar `npm run dev` después de crear `.env`.
  - Dejar espacios: `VITE_API_URL = http://...` puede generar valores inesperados. Escribirlo sin espacios alrededor del `=`.

### Paso 5 — Cliente HTTP reutilizable

- **Archivo:** `api.ts`
- **Ruta:** `frontend/src/services/api.ts`

```ts
/**
 * Cliente HTTP de la aplicación.
 * Centraliza fetch: URL base, encabezados, conversión a JSON y manejo de errores.
 */

// La URL de la API se lee de las variables de entorno (archivo .env).
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

/** Error con la información que devuelve el backend: { mensaje, errores? } */
export class ApiError extends Error {
  status: number;
  errores: string[];

  constructor(status: number, mensaje: string, errores: string[] = []) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status; // 0 significa "no hubo respuesta del servidor"
    this.errores = errores;
  }
}

interface RespuestaDeError {
  mensaje?: string;
  errores?: string[];
}

/**
 * Hace una petición a la API y devuelve el cuerpo de la respuesta ya convertido.
 * @param ruta     por ejemplo '/productos' o '/productos/123'
 * @param opciones method, body, etc. (las mismas de fetch)
 */
export async function solicitar<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  let respuesta: Response;

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      // Solo indicamos Content-Type cuando enviamos un cuerpo JSON (POST, PUT, PATCH).
      headers: opciones.body ? { 'Content-Type': 'application/json' } : undefined,
      ...opciones,
    });
  } catch {
    // fetch solo falla aquí si NO hubo respuesta: servidor apagado, URL mal escrita, CORS...
    throw new ApiError(0, 'No se pudo conectar con el servidor. Verifica que el backend esté encendido.');
  }

  // 204 No Content: la operación funcionó pero no hay cuerpo (por ejemplo, DELETE).
  if (respuesta.status === 204) {
    return undefined as T;
  }

  const cuerpo: unknown = await respuesta.json().catch(() => null);

  // respuesta.ok es true para los códigos 200-299.
  if (!respuesta.ok) {
    const error = (cuerpo ?? {}) as RespuestaDeError;
    throw new ApiError(respuesta.status, error.mensaje ?? `Error ${respuesta.status}`, error.errores ?? []);
  }

  return cuerpo as T;
}

/** Convierte cualquier error en un texto que podamos mostrar al usuario. */
export function obtenerMensajeDeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Ocurrió un error inesperado';
}
```

- **Explicación:**
  - `API_URL` se toma de `.env`, con un valor por defecto.
  - `ApiError` extiende `Error` para guardar además el `status` y la lista de `errores` que envía el backend.
  - `solicitar<T>` es una función **genérica**: `T` es el tipo de dato que esperamos recibir (`Producto[]`, `Producto`...).
  - Distingue tres situaciones: **sin respuesta** (`catch` → status 0), **204** (sin cuerpo) y **4xx/5xx** (`!respuesta.ok` → lanza `ApiError` con el mensaje del servidor).
  - Solo envía `Content-Type: application/json` cuando hay cuerpo. En la sesión 6 veremos que eso evita peticiones extra (*preflight*) en los GET.
- **Resultado esperado:** sin errores. Todavía no se usa: la página lo usará en el paso 6.
- **Errores frecuentes:** llamar a `respuesta.json()` en una respuesta 204 → `SyntaxError: Unexpected end of JSON input`. Por eso el caso 204 se atiende primero.

### Paso 6 — Cargar los productos con `useEffect`

- **Archivo:** `InventarioPage.tsx` (reemplaza la versión de la sesión 2)
- **Ruta:** `frontend/src/pages/InventarioPage.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Alerta, type MensajeAlerta } from '../components/Alerta';
import { BarraFiltros, type FiltroCategoria } from '../components/BarraFiltros';
import { Cargando } from '../components/Cargando';
import { ProductoFormulario } from '../components/ProductoFormulario';
import { ProductoTabla } from '../components/ProductoTabla';
import { ResumenInventario } from '../components/ResumenInventario';
import { obtenerMensajeDeError } from '../services/api';
import { obtenerProductosDemo } from '../services/productoService';
import type { Producto, ProductoDatos } from '../types/producto';

/**
 * Página principal del inventario (versión de la sesión 3).
 * Los productos se CARGAN con fetch (archivo JSON de demostración).
 * Crear, editar y eliminar siguen ocurriendo en el estado de React hasta la sesión 6.
 */
export function InventarioPage() {
  // ---------- Estado ----------
  const [productos, setProductos] = useState<Producto[]>([]); // empieza vacío: los datos llegan después
  const [cargando, setCargando] = useState(true);
  const [errorDeCarga, setErrorDeCarga] = useState<string | null>(null);
  const [intentoDeCarga, setIntentoDeCarga] = useState(0);
  const [mensaje, setMensaje] = useState<MensajeAlerta | null>(null);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<FiltroCategoria>('Todas');

  // ---------- Carga de productos (GET) ----------
  // El efecto se ejecuta al mostrar la página y cada vez que cambia `intentoDeCarga`.
  useEffect(() => {
    let cancelado = false;

    async function cargarProductos() {
      try {
        const datos = await obtenerProductosDemo();
        if (!cancelado) {
          setProductos(datos);
          setErrorDeCarga(null);
        }
      } catch (error) {
        if (!cancelado) setErrorDeCarga(obtenerMensajeDeError(error));
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargarProductos();

    // Limpieza: si el efecto se repite antes de que llegue la respuesta,
    // ignoramos la respuesta anterior. (En desarrollo, StrictMode ejecuta
    // el efecto dos veces a propósito: verás dos peticiones GET.)
    return () => {
      cancelado = true;
    };
  }, [intentoDeCarga]);

  function reintentarCarga() {
    setCargando(true);
    setErrorDeCarga(null);
    setIntentoDeCarga((intento) => intento + 1); // cambia la dependencia -> el efecto se repite
  }

  // ---------- Crear y editar ----------
  function iniciarEdicion(producto: Producto) {
    setMensaje(null);
    setProductoEditando(producto);
  }

  function guardarProducto(datos: ProductoDatos): boolean {
    // Regla de negocio: el código no se puede repetir (excepto el del mismo producto que editamos).
    const codigoRepetido = productos.some(
      (producto) => producto.codigo === datos.codigo && producto.id !== productoEditando?.id,
    );
    if (codigoRepetido) {
      setMensaje({ tipo: 'error', texto: `Ya existe un producto con el código ${datos.codigo}` });
      return false;
    }

    const ahora = new Date().toISOString();

    if (productoEditando) {
      const actualizado: Producto = { ...productoEditando, ...datos, updatedAt: ahora };
      setProductos(productos.map((producto) => (producto.id === actualizado.id ? actualizado : producto)));
      setProductoEditando(null);
      setMensaje({ tipo: 'exito', texto: `Producto "${actualizado.nombre}" actualizado.` });
    } else {
      const nuevo: Producto = { ...datos, id: crypto.randomUUID(), createdAt: ahora, updatedAt: ahora };
      setProductos([nuevo, ...productos]); // nuevo arreglo: el nuevo producto primero
      setMensaje({ tipo: 'exito', texto: `Producto "${nuevo.nombre}" agregado al inventario.` });
    }
    return true;
  }

  // ---------- Eliminar ----------
  function eliminarProducto(producto: Producto) {
    const confirmado = window.confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    setProductos(productos.filter((item) => item.id !== producto.id));
    if (productoEditando?.id === producto.id) {
      setProductoEditando(null);
    }
    setMensaje({ tipo: 'exito', texto: `Producto "${producto.nombre}" eliminado.` });
  }

  // ---------- Ajustar stock ----------
  function cambiarStock(producto: Producto, cantidad: number) {
    const nuevoStock = producto.stock + cantidad;
    if (nuevoStock < 0) return;

    setProductos(productos.map((item) => (item.id === producto.id ? { ...item, stock: nuevoStock } : item)));
  }

  // ---------- Filtros (valores derivados, no son estado) ----------
  const textoBuscado = busqueda.trim().toLowerCase();
  const productosFiltrados = productos.filter((producto) => {
    const coincideTexto =
      producto.nombre.toLowerCase().includes(textoBuscado) || producto.codigo.toLowerCase().includes(textoBuscado);
    const coincideCategoria = categoriaFiltro === 'Todas' || producto.categoria === categoriaFiltro;
    return coincideTexto && coincideCategoria;
  });

  // ---------- Renderizado condicional ----------
  function renderizarContenido() {
    if (cargando) {
      return <Cargando texto="Cargando inventario..." />;
    }

    if (errorDeCarga) {
      return (
        <div className="estado-error">
          <p>
            <strong>No pudimos cargar los productos.</strong>
          </p>
          <p>{errorDeCarga}</p>
          <button type="button" className="boton boton--primario" onClick={reintentarCarga}>
            Reintentar
          </button>
        </div>
      );
    }

    return (
      <>
        <ResumenInventario productos={productos} />

        <div className="inventario">
          <section className="panel panel--formulario">
            {/* La key cambia al editar otro producto: React crea un formulario nuevo con esos datos. */}
            <ProductoFormulario
              key={productoEditando?.id ?? 'nuevo'}
              productoInicial={productoEditando}
              onGuardar={guardarProducto}
              onCancelar={() => setProductoEditando(null)}
            />
          </section>

          <section className="panel">
            <div className="panel__cabecera">
              <h2 className="panel__titulo">Productos</h2>
              <span className="panel__contador">
                {productosFiltrados.length} de {productos.length}
              </span>
            </div>
            <BarraFiltros
              busqueda={busqueda}
              categoria={categoriaFiltro}
              onBusquedaChange={setBusqueda}
              onCategoriaChange={setCategoriaFiltro}
            />
            <ProductoTabla
              productos={productosFiltrados}
              idEditando={productoEditando?.id ?? null}
              onEditar={iniciarEdicion}
              onEliminar={eliminarProducto}
              onCambiarStock={cambiarStock}
            />
          </section>
        </div>
      </>
    );
  }

  return (
    <main className="contenedor">
      {mensaje && <Alerta mensaje={mensaje} onCerrar={() => setMensaje(null)} />}
      {renderizarContenido()}
    </main>
  );
}
```

- **Explicación:**
  - El estado `productos` **empieza vacío**; los datos llegan después.
  - Tres estados nuevos: `cargando` (empieza en `true`), `errorDeCarga` e `intentoDeCarga`.
  - Dentro del `useEffect` se define `cargarProductos` (async) y se llama de inmediato. `finally` apaga el indicador de carga, sin importar si hubo éxito o error.
  - **La variable `cancelado` y la función de limpieza:** si el efecto se repite antes de que llegue la respuesta anterior, esa respuesta se ignora. Esto evita mostrar datos viejos.
  - `reintentarCarga` cambia `intentoDeCarga`, que está en las dependencias `[intentoDeCarga]`, y el efecto se repite.
  - `renderizarContenido()` concentra el renderizado condicional: **cargando → error → contenido**.
  - `obtenerMensajeDeError` (del paso 5) convierte cualquier error en un texto para mostrar.
  - Crear, editar y eliminar **siguen siendo locales** (como en la sesión 2).
- **Resultado esperado:** al abrir la app se ve *"Cargando inventario..."* durante 1 segundo y luego la tabla. En *Network* aparecen **dos** peticiones a `productos-demo.json` (por StrictMode).
- **Errores frecuentes:**
  - Declarar la función del efecto como `useEffect(async () => ...)` → React advierte que un efecto no puede devolver una Promesa. La función async se define **dentro**.
  - Olvidar el arreglo de dependencias → el efecto se ejecuta en cada render: bucle de peticiones.

### Paso 7 — Servicio de productos completo

- **Archivo:** `productoService.ts` (versión completa)
- **Ruta:** `frontend/src/services/productoService.ts`

```ts
import type { Producto, ProductoDatos } from '../types/producto';
import { solicitar } from './api';

/**
 * Servicio de productos: una función por cada endpoint de la API.
 * Los componentes llaman a estas funciones y NUNCA usan fetch directamente.
 */

const RUTA = '/productos';

/** GET /productos */
export function obtenerProductos(): Promise<Producto[]> {
  return solicitar<Producto[]>(RUTA);
}

/** GET /productos/:id */
export function obtenerProductoPorId(id: string): Promise<Producto> {
  return solicitar<Producto>(`${RUTA}/${id}`);
}

/** POST /productos */
export function crearProducto(datos: ProductoDatos): Promise<Producto> {
  return solicitar<Producto>(RUTA, {
    method: 'POST',
    body: JSON.stringify(datos), // objeto JS -> texto JSON
  });
}

/** PUT /productos/:id  (se envían todos los campos) */
export function actualizarProducto(id: string, datos: ProductoDatos): Promise<Producto> {
  return solicitar<Producto>(`${RUTA}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

/** PATCH /productos/:id  (se envían solo los campos que cambian) */
export function actualizarProductoParcial(id: string, cambios: Partial<ProductoDatos>): Promise<Producto> {
  return solicitar<Producto>(`${RUTA}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(cambios),
  });
}

/** DELETE /productos/:id */
export function eliminarProducto(id: string): Promise<void> {
  return solicitar<void>(`${RUTA}/${id}`, { method: 'DELETE' });
}

/**
 * TEMPORAL (sesión 3): lee un archivo JSON estático de la carpeta public/.
 * Nos permite practicar fetch antes de tener backend. Se elimina en la sesión 6.
 */
export async function obtenerProductosDemo(): Promise<Producto[]> {
  // Simulamos 1 segundo de espera para poder ver el estado "Cargando..."
  await new Promise((resolver) => setTimeout(resolver, 1000));

  const respuesta = await fetch('/productos-demo.json');
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}: no se pudo cargar el archivo de productos`);
  }
  return respuesta.json();
}
```

- **Explicación:** una función por endpoint de la API (tabla 4.3). Todavía **no se usan** (el backend no existe); quedan listas para la sesión 6. La página sigue usando `obtenerProductosDemo`. Así el servicio se convierte en el **contrato** entre el frontend y el backend.
- **Resultado esperado:** `npm run build` termina sin errores.
- **Errores frecuentes:** olvidar `JSON.stringify` en el `body`. Se enviaría `[object Object]`.

### Taller "rompe y observa"

| Provoca esto | Qué debe mostrar la interfaz | Qué ves en *Network* |
|--------------|------------------------------|----------------------|
| Renombra `productos-demo.json` a `productos-demo.bak` | Error: *Error 404: no se pudo cargar...* + botón Reintentar | Petición en rojo, status 404 |
| Vuelve a nombrarlo bien y pulsa **Reintentar** | La tabla carga | Nueva petición 200 |
| Agrega una coma sobrante al final del JSON | Error de sintaxis JSON | Status 200, pero el contenido es inválido |
| En DevTools → Network → *Throttling* elige **Slow 3G** | "Cargando" dura más | La barra de tiempo es más larga |
| Activa **Offline** en *Throttling* y recarga | La página misma no carga | Todo falla (no hay red) |

---

## 8. Actividad práctica (parejas, 15 min)

1. Completar la tabla del taller con capturas.
2. Escribir en un comentario de `productoService.ts`, para cada función, qué **código de estado** esperan recibir si todo sale bien.
3. Cambiar el tiempo de espera simulado a 3 segundos y verificar que el botón *Agregar producto* no aparece hasta que termina la carga. ¿Por qué? Porque el formulario está dentro del contenido que se muestra después de cargar.

## 9. Reto

Mostrar en el panel de productos la **hora de la última carga** (por ejemplo, *Actualizado a las 10:42:05*) y un botón **"Actualizar"** que vuelva a cargar los datos. Pista: un estado `ultimaCarga: Date | null` que se asigna cuando llegan los datos, y reutilizar `reintentarCarga`.

## 10. Preguntas de comprobación (con respuesta esperada)

1. **¿Qué partes tiene una respuesta HTTP?** Código de estado, encabezados y (opcionalmente) cuerpo.
2. **¿Qué método y URL usarías para actualizar solo el stock del producto 7?** `PATCH /api/productos/7` con cuerpo `{ "stock": ... }`.
3. **¿`fetch` lanza un error si el servidor responde 404?** No. Solo falla si no hay respuesta; hay que revisar `respuesta.ok`.
4. **¿Por qué la carga de datos va dentro de `useEffect`?** Porque debe ejecutarse después del render y una sola vez (o cuando cambien sus dependencias). En el cuerpo del componente causaría un ciclo infinito.
5. **¿Por qué ves dos peticiones GET en desarrollo?** Por `StrictMode`, que monta dos veces los componentes para detectar efectos incorrectos. En producción hay una sola.
6. **¿Puedo guardar una contraseña en `VITE_ALGO`?** No. Las variables `VITE_` se incluyen en el código que descarga el navegador: son públicas.

## 11. Evidencia de aprendizaje

- Captura de la pestaña **Network** con la petición a `productos-demo.json` abierta (status 200 y pestaña *Response*).
- Captura del **estado de error** con el botón Reintentar.
- Tabla del taller "rompe y observa" completa.
- Commit: `git commit -m "Sesión 3: fetch, useEffect, estados de carga y servicio HTTP"`.

## 12. Tarea (autónoma, ~1,5 h)

1. Instalar una herramienta para probar APIs: **Thunder Client** o **REST Client** (extensiones de VS Code), **Postman** o **Insomnia**.
2. Con esa herramienta, hacer un GET a una API pública (por ejemplo `https://jsonplaceholder.typicode.com/users/1`) y capturar la respuesta.
3. **Preparación para la sesión 4:** verificar que `node -v` funciona. Leer en la documentación de Node.js la sección "Introduction to Node.js".
