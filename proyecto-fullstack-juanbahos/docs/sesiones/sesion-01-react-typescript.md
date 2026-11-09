# Sesión 1 — Introducción a React + TypeScript

> **Proyecto:** StockFácil · **Bloque:** Frontend (1 de 3) · **Duración:** 120 minutos
> **Al terminar la sesión:** la aplicación muestra el resumen del inventario y una tabla de productos construida con componentes, props y estado.

---

## 1. Objetivo de aprendizaje

Al finalizar la sesión, el estudiante será capaz de **crear un proyecto React + TypeScript con Vite** y **construir una interfaz dividida en componentes** que reciben datos por *props* y muestran información a partir de un *estado* inicial.

## 2. Competencias

| Tipo | Competencia |
|------|-------------|
| Conceptual | Explica qué es una SPA, qué problema resuelve React y qué aporta TypeScript frente a JavaScript. |
| Procedimental | Crea un proyecto con Vite, organiza carpetas y escribe componentes funcionales en TSX con props tipadas. |
| Procedimental | Usa `useState` para guardar datos y `map()` para renderizar listas. |
| Actitudinal | Valora la organización del código en piezas pequeñas y con nombres descriptivos. |

## 3. Conceptos previos

- HTML: etiquetas, atributos, tablas (`<table>`, `<tr>`, `<td>`).
- CSS: clases y selectores básicos.
- JavaScript: `const`/`let`, funciones flecha, objetos, arreglos, `map()`, `filter()`, `reduce()`, plantillas de texto con `` ` ``, desestructuración `{ a, b } = objeto`, `import`/`export`.
- Uso básico de la terminal: `cd`, `mkdir`, ejecutar comandos.

**Verificación rápida (2 min):** pedir que en la consola del navegador ejecuten `[1, 2, 3].map(n => n * 2)`. Si alguien no reconoce `map`, anotarlo para darle apoyo en el desarrollo guiado.

**Instalaciones previas (enviar antes de la clase):** Node.js 22 LTS o superior, Visual Studio Code y Git. Verificar con `node -v` y `npm -v`.

---

## 4. Teoría

### 4.1 SPA (Single Page Application)

- **Qué es:** una aplicación web que carga **una sola página HTML** y después cambia su contenido con JavaScript, sin recargar la página completa.
- **Para qué sirve:** para crear interfaces rápidas e interactivas, parecidas a una aplicación de escritorio.
- **Por qué se utiliza:** evita recargar todo el sitio en cada clic. Solo se piden **datos** al servidor y el navegador redibuja la parte de la pantalla que cambió.
- **Ejemplo sencillo:** en Gmail, al abrir un correo la página no se recarga. Cambia solo el panel central.
- **Aplicación en el proyecto:** StockFácil tiene un único `index.html` con un `<div id="root">`. React dibuja allí toda la aplicación, y al crear o eliminar un producto solo cambia la tabla.

### 4.2 React

- **Qué es:** una biblioteca de JavaScript, creada por Meta, para construir interfaces de usuario a partir de **componentes**.
- **Para qué sirve:** para describir **cómo debe verse** la interfaz según los datos. React se encarga de actualizar el DOM cuando esos datos cambian.
- **Por qué se utiliza:** es **declarativo**: decimos *qué* mostrar, no *cómo* modificar cada elemento del DOM. Además, favorece la reutilización y es el estándar más usado en la industria.
- **Ejemplo sencillo:**
  ```tsx
  function Saludo() {
    return <h1>Hola, StockFácil</h1>;
  }
  ```
- **Aplicación en el proyecto:** toda la interfaz (encabezado, resumen, tabla) está hecha con componentes de React.

### 4.3 TypeScript

- **Qué es:** JavaScript **con tipos**. Es un lenguaje que se compila (se traduce) a JavaScript.
- **Para qué sirve:** para detectar errores **mientras escribimos** el código, antes de ejecutarlo, y para tener autocompletado.
- **Por qué se utiliza:** en proyectos reales, muchos errores vienen de datos con una forma inesperada (un `undefined`, un número que llega como texto). Los tipos los hacen visibles.
- **Ejemplo sencillo:**
  ```ts
  function calcularTotal(precio: number, cantidad: number): number {
    return precio * cantidad;
  }
  calcularTotal(1000, '3'); // ❌ Error: '3' es string, se esperaba number
  ```
- **Aplicación en el proyecto:** la interfaz `Producto` describe exactamente qué campos tiene un producto. Si escribimos `producto.precoi`, el editor lo marca en rojo.

### 4.4 JavaScript vs TypeScript

| Aspecto | JavaScript | TypeScript |
|---------|-----------|------------|
| Tipos | Dinámicos: se descubren al ejecutar | Estáticos: se revisan al escribir |
| Errores de tipo | Aparecen en el navegador (tarde) | Aparecen en el editor (temprano) |
| Autocompletado | Limitado | Completo, basado en tipos |
| Ejecución | Directa en navegador y Node.js | Se compila a JavaScript |
| Extensión | `.js`, `.jsx` | `.ts`, `.tsx` |

> **Mensaje clave:** TypeScript no reemplaza a JavaScript: **es JavaScript + tipos**. Todo lo que sabes de JS sigue sirviendo.

### 4.5 Vite

- **Qué es:** una herramienta de construcción (*build tool*) y servidor de desarrollo para proyectos web modernos.
- **Para qué sirve:** crea la estructura inicial del proyecto, levanta un servidor local con **recarga instantánea** (HMR) y genera la versión optimizada para producción (`npm run build`).
- **Por qué se utiliza:** es mucho más rápido que alternativas antiguas como Create React App, que ya está obsoleta, y viene configurado para React + TypeScript.
- **Ejemplo sencillo:** `npm create vite@latest frontend -- --template react-ts`
- **Aplicación en el proyecto:** la carpeta `frontend/` se crea con Vite y se ejecuta con `npm run dev` en `http://localhost:5173`.

### 4.6 Componentes

- **Qué es:** una **función** que devuelve la descripción de una parte de la interfaz. Su nombre empieza con **mayúscula**.
- **Para qué sirve:** para dividir la pantalla en piezas pequeñas, fáciles de entender, probar y reutilizar.
- **Por qué se utiliza:** una pantalla de 500 líneas es difícil de mantener; diez componentes de 50 líneas, no.
- **Ejemplo sencillo:** `<Encabezado />`, `<ProductoTabla />`, `<ProductoFila />`.
- **Aplicación en el proyecto:**
  ```
  App
  ├── Encabezado
  └── InventarioPage
      ├── ResumenInventario
      └── ProductoTabla
          └── ProductoFila  (una por producto)
  ```

### 4.7 JSX / TSX

- **Qué es:** una sintaxis que permite escribir algo parecido a HTML dentro de JavaScript (JSX) o TypeScript (TSX).
- **Para qué sirve:** para describir la interfaz de forma visual y legible.
- **Por qué se utiliza:** mezcla la estructura (HTML) con los datos (JS) en un mismo lugar.
- **Diferencias con HTML** (errores típicos):

  | HTML | JSX/TSX |
  |------|---------|
  | `class="..."` | `className="..."` |
  | `for="..."` | `htmlFor="..."` |
  | `<input>` | `<input />` (toda etiqueta se cierra) |
  | `onclick="..."` | `onClick={funcion}` |
  | — | `{expresion}` para insertar valores JS |

- **Ejemplo sencillo:** `<p className="precio">{formatearPrecio(producto.precio)}</p>`
- **Aplicación en el proyecto:** todos los archivos `.tsx` de `components/` y `pages/`.

### 4.8 Props

- **Qué es:** los **parámetros** de un componente. Son datos que un componente padre le pasa a un hijo.
- **Para qué sirve:** para que un mismo componente muestre información distinta, por ejemplo una fila por cada producto.
- **Por qué se utiliza:** hace los componentes **reutilizables**. Las props son de **solo lectura**: el hijo no las modifica.
- **Ejemplo sencillo:**
  ```tsx
  interface SaludoProps { nombre: string }
  function Saludo({ nombre }: SaludoProps) {
    return <p>Hola, {nombre}</p>;
  }
  <Saludo nombre="Ana" />
  ```
- **Aplicación en el proyecto:** `ProductoTabla` recibe `productos` y le pasa a cada `ProductoFila` su `producto`.

### 4.9 Estado (`useState`)

- **Qué es:** datos que **pertenecen** a un componente y que pueden **cambiar** con el tiempo.
- **Para qué sirve:** cuando el estado cambia, React **vuelve a dibujar** (re-renderiza) el componente de forma automática.
- **Por qué se utiliza:** una variable normal (`let x`) cambia, pero React no se entera y la pantalla no se actualiza. Con `useState`, React sí se entera.
- **Ejemplo sencillo:**
  ```tsx
  const [contador, setContador] = useState(0);
  <button onClick={() => setContador(contador + 1)}>{contador}</button>
  ```
- **Aplicación en el proyecto:** `InventarioPage` guarda la lista de `productos` en el estado y un booleano `soloStockBajo` para filtrar la tabla.

### 4.10 Estructura del proyecto

```
frontend/
├── index.html          ← única página HTML (tiene <div id="root">)
├── package.json        ← dependencias y scripts (dev, build, lint)
├── vite.config.ts      ← configuración de Vite
├── tsconfig*.json      ← configuración de TypeScript
├── public/             ← archivos estáticos (favicon)
└── src/
    ├── main.tsx        ← punto de entrada: monta <App /> en #root
    ├── App.tsx         ← componente raíz
    ├── index.css       ← estilos globales
    ├── components/     ← piezas reutilizables
    ├── pages/          ← pantallas completas
    ├── types/          ← interfaces y tipos
    ├── data/           ← datos de ejemplo (temporal)
    └── utils/          ← funciones de apoyo
```

**Buena práctica que aparece hoy: componentización y nombres descriptivos.** Un archivo por componente, con el mismo nombre del componente (`ProductoFila.tsx` → `export function ProductoFila`), y en español, coherente con el dominio del problema.

---

## 5. Distribución de los 120 minutos

| Tiempo | Actividad | Descripción |
|--------|-----------|-------------|
| 0 – 10 min | Introducción | Presentación del curso y del proyecto StockFácil. Demostración de la app final. |
| 10 – 30 min | Teoría | SPA, React, TypeScript, JS vs TS, Vite, componentes, TSX, props, estado. |
| 30 – 50 min | Demostración | El docente crea el proyecto con Vite y explica la estructura y `main.tsx`. |
| 50 – 90 min | Desarrollo guiado | Tipos, datos, `Encabezado`, `ProductoFila`, `ProductoTabla`, `ResumenInventario`, `InventarioPage`. |
| 90 – 110 min | Taller | Actividad práctica y reto en parejas. |
| 110 – 120 min | Cierre | Preguntas de comprobación, evidencia y tarea. |

---

## 6. Libreto del docente

### 0 – 10 min · Introducción

> **Docente:** "Bienvenidos. Durante 8 sesiones vamos a construir **una sola aplicación**, de principio a fin, como se hace en una empresa: StockFácil, un sistema de inventario para una tienda de barrio."

1. **Mostrar la aplicación terminada** (del repositorio de referencia): crear un producto, editarlo, eliminarlo y mostrar el resumen.
2. **Pregunta a la clase:** *"¿Dónde creen que queda guardado el producto que acabo de crear?"* Dejar que respondan: "en la página", "en internet", "en una base de datos"...
3. Dibujar en el tablero el mapa del curso:
   ```
   INTERFAZ → REACT + TS → API REST → EXPRESS → CONTROLLERS → MODELOS → MONGODB
     S1-S3                  S3-S6        S4-S6                  S7-S8
   ```
4. **Mensaje clave:** "Hoy empezamos por la capa que ve el usuario. Los datos van a estar escritos en el código; en unas semanas vendrán de una base de datos real."

### 10 – 30 min · Teoría

- **SPA (3 min):** abrir Gmail o YouTube y mostrar en la pestaña *Network* que al navegar no se recarga el documento completo.
  > **Pregunta:** *"¿Qué ventaja tiene no recargar toda la página?"* (Velocidad y mejor experiencia.)
- **React (4 min):** explicar "declarativo" con una analogía:
  > "Con JavaScript puro le dices al DOM paso a paso: *crea un tr, agrégale un td, pon este texto...* Con React le describes el resultado: *quiero una tabla con estos productos*. React se encarga del resto."
- **TypeScript (5 min):** mostrar en vivo en VS Code un archivo `.ts` con `calcularTotal(1000, '3')` y el subrayado rojo.
  > **Pregunta:** *"¿En qué momento prefieren enterarse del error: mientras escriben o cuando el cliente lo ve?"*
- **Componentes, TSX y props (5 min):** dibujar la pantalla de StockFácil y pedir a la clase que la **divida en cajas**. Cada caja es un componente candidato. Comparar con el árbol de la sección 4.6.
- **Estado (3 min):** analogía del marcador de un partido. Si cambia el marcador, la pantalla del estadio se actualiza sola. El estado es el marcador; React es la pantalla.

### 30 – 50 min · Demostración (el docente proyecta; los estudiantes observan)

1. Crear el proyecto (Paso 1 del desarrollo práctico) y abrirlo en VS Code.
2. Recorrer la estructura: `index.html` → `main.tsx` → `App.tsx`.
   > **Pregunta:** *"Si index.html casi no tiene contenido, ¿de dónde sale lo que vemos?"* (De `main.tsx`, que monta `App` dentro de `#root`.)
3. Cambiar un texto de `App.tsx`, guardar y mostrar la **recarga instantánea** (HMR).
4. Provocar un error de TypeScript a propósito y mostrar dónde aparece: en el editor y en la terminal al ejecutar `npm run build`.

### 50 – 90 min · Desarrollo guiado (todos programan a la vez)

- Seguir los **pasos 2 a 10**. Después de cada paso, pedir que alguien diga en voz alta qué hace el archivo.
- **Momento de interacción (paso 6):** antes de escribir `ProductoFila`, preguntar: *"¿Qué datos necesita una fila para dibujarse?"* Y en `ProductoTabla`: *"¿qué necesita la tabla?"* Así se deducen las props juntos.
- **Momento de interacción (paso 8):** en `ResumenInventario`, pedir a la clase que diga cómo calcular el valor del inventario (precio × stock, sumado). Escribir la fórmula entre todos.
- Recorrer el salón revisando los errores frecuentes de cada paso.

### 90 – 110 min · Taller

- Parejas. Actividad práctica (sección 8) y, si terminan, el reto (sección 9).
- El docente circula y hace preguntas individuales: *"¿Por qué esta prop tiene ese tipo?"*, *"¿Qué pasa si quitas la key?"*

### 110 – 120 min · Cierre

- Tres preguntas de comprobación al azar (sección 10).
- Recordar la evidencia y la tarea.
- **Frase de cierre:** "Hoy la interfaz **muestra** datos. La próxima clase vamos a **modificarlos**: crear, editar y eliminar productos."

---

## 7. Desarrollo práctico

### Paso 1 — Crear el proyecto con Vite

- **Archivo:** — (comandos en la terminal)
- **Ruta:** carpeta de trabajo del estudiante

```bash
mkdir proyecto-fullstack
cd proyecto-fullstack
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm run dev
```

- **Explicación:** `npm create vite` descarga la plantilla oficial de React + TypeScript en la carpeta `frontend`. Si el asistente pregunta *"Install with npm and start now?"*, responder **No** y ejecutar los comandos a mano para ver cada paso. `npm install` descarga las dependencias en `node_modules/`. `npm run dev` inicia el servidor de desarrollo.
- **Resultado esperado:** la terminal muestra `Local: http://localhost:5173/`. Al abrirlo aparece la página de bienvenida de Vite + React.
- **Errores frecuentes:**
  - `npm: command not found` → Node.js no está instalado o no está en el PATH. Reinstalar Node y **abrir una terminal nueva**.
  - Vite pide una versión mínima de Node → actualizar a Node 22 LTS o superior.
  - Ejecutar `npm run dev` fuera de la carpeta `frontend` → `Missing script: "dev"`. Revisar con `pwd` o `cd`.

### Paso 2 — Limpiar la plantilla y agregar los estilos

- **Archivos:** `App.css`, `assets/`, `index.html`, `index.css`, `vite.config.ts`
- **Ruta:** `frontend/`

1. Borrar `src/App.css`, la carpeta `src/assets/` y los íconos de ejemplo de `public/` (conservar `favicon.svg`).
2. En `index.html` cambiar `lang="en"` por `lang="es"` y el `<title>` por `StockFácil · Inventario`.
3. Reemplazar `src/index.css` por la hoja de estilos del curso (`frontend/src/index.css` del repositorio de referencia).
4. Configurar el puerto fijo en `vite.config.ts`:

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Si el puerto 5173 está ocupado, Vite muestra un error en lugar de usar otro puerto.
    // Así evitamos errores de CORS (el backend solo acepta http://localhost:5173).
    strictPort: true,
  },
})
```

- **Explicación:** la hoja de estilos se entrega completa para concentrar la clase en React. Usa variables CSS y nombres de clase con la convención `bloque__elemento--modificador`. `strictPort` evita que Vite cambie de puerto sin avisar, lo que en la sesión 6 causaría errores de CORS.
- **Resultado esperado:** la página se ve vacía o con errores de importación. Es normal: `App.tsx` todavía importa archivos que borramos. Lo arreglamos en el paso 10.
- **Errores frecuentes:** olvidar quitar `import './App.css'` de `App.tsx` provoca el error `Failed to resolve import "./App.css"`.

### Paso 3 — Definir el tipo `Producto`

- **Archivo:** `producto.ts`
- **Ruta:** `frontend/src/types/producto.ts`

```ts
/**
 * Categorías permitidas (deben coincidir con las del backend).
 * `as const` convierte el arreglo en una lista de valores fijos.
 */
export const CATEGORIAS = ['Electrónica', 'Papelería', 'Alimentos', 'Aseo', 'Hogar', 'Otros'] as const;

/** 'Electrónica' | 'Papelería' | 'Alimentos' | 'Aseo' | 'Hogar' | 'Otros' */
export type Categoria = (typeof CATEGORIAS)[number];

/** A partir de esta cantidad (o menos) un producto se considera con stock bajo. */
export const STOCK_MINIMO = 5;

/** Un producto tal como lo devuelve la API. */
export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: Categoria;
  precio: number;
  stock: number;
  createdAt: string; // las fechas llegan como texto en el JSON
  updatedAt: string;
}

/**
 * Datos que enviamos para crear o actualizar un producto.
 * Omit<> copia la interfaz Producto quitando los campos que genera el servidor.
 */
export type ProductoDatos = Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>;
```

- **Explicación:**
  - `CATEGORIAS ... as const` crea una lista fija; `Categoria` es un **tipo unión** con esos seis textos exactos.
  - `interface Producto` describe la forma de cada producto. Coincide con lo que devolverá la API en la sesión 6.
  - `Omit<Producto, ...>` crea un tipo nuevo **sin** los campos que genera el servidor. Lo usaremos en la sesión 2.
  - `STOCK_MINIMO` evita escribir el número `5` repetido por todo el código: es un **número mágico** convertido en constante con nombre.
- **Resultado esperado:** el archivo no muestra errores en VS Code.
- **Errores frecuentes:** escribir `Interface` con mayúscula, u olvidar `export` (después aparece `Module has no exported member 'Producto'`).

### Paso 4 — Datos de ejemplo

- **Archivo:** `productosIniciales.ts`
- **Ruta:** `frontend/src/data/productosIniciales.ts`

```ts
import type { Producto } from '../types/producto';

/**
 * Datos de ejemplo para las sesiones 1 y 2.
 * En la sesión 3 los leeremos con fetch y en la sesión 6 vendrán del backend.
 */
export const productosIniciales: Producto[] = [
  {
    id: '1',
    codigo: 'ELE-001',
    nombre: 'Audífonos inalámbricos',
    descripcion: 'Bluetooth 5.3, estuche de carga',
    categoria: 'Electrónica',
    precio: 89900,
    stock: 12,
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: '2',
    codigo: 'ELE-002',
    nombre: 'Cable USB-C 1 m',
    descripcion: 'Carga rápida 60 W',
    categoria: 'Electrónica',
    precio: 15900,
    stock: 3,
    createdAt: '2026-01-10T10:05:00.000Z',
    updatedAt: '2026-01-10T10:05:00.000Z',
  },
  {
    id: '3',
    codigo: 'PAP-001',
    nombre: 'Cuaderno cuadriculado 100 hojas',
    descripcion: 'Tamaño carta, tapa dura',
    categoria: 'Papelería',
    precio: 7500,
    stock: 40,
    createdAt: '2026-01-11T09:00:00.000Z',
    updatedAt: '2026-01-11T09:00:00.000Z',
  },
  {
    id: '4',
    codigo: 'PAP-002',
    nombre: 'Esfero negro',
    descripcion: '',
    categoria: 'Papelería',
    precio: 1200,
    stock: 0,
    createdAt: '2026-01-11T09:10:00.000Z',
    updatedAt: '2026-01-11T09:10:00.000Z',
  },
  {
    id: '5',
    codigo: 'ALI-001',
    nombre: 'Café molido 500 g',
    descripcion: 'Origen Huila, tostión media',
    categoria: 'Alimentos',
    precio: 24500,
    stock: 18,
    createdAt: '2026-01-12T08:30:00.000Z',
    updatedAt: '2026-01-12T08:30:00.000Z',
  },
  {
    id: '6',
    codigo: 'ASE-001',
    nombre: 'Jabón líquido de manos',
    descripcion: 'Presentación de 1 litro',
    categoria: 'Aseo',
    precio: 11900,
    stock: 5,
    createdAt: '2026-01-12T08:45:00.000Z',
    updatedAt: '2026-01-12T08:45:00.000Z',
  },
];
```

- **Explicación:** `Producto[]` significa "arreglo de productos". TypeScript revisa que **cada** objeto tenga todos los campos con el tipo correcto. `import type` importa solo el tipo, que desaparece al compilar.
- **Resultado esperado:** sin errores. **Prueba didáctica:** cambiar `categoria: 'Aseo'` por `'Ropa'` y ver el error: `Type '"Ropa"' is not assignable to type 'Categoria'`. Después, deshacer el cambio.
- **Errores frecuentes:** precio entre comillas (`'89900'`) → error de tipo. ¡TypeScript funcionando!

### Paso 5 — Funciones de formato

- **Archivo:** `formato.ts`
- **Ruta:** `frontend/src/utils/formato.ts`

```ts
import { STOCK_MINIMO } from '../types/producto';

// Se crea una sola vez y se reutiliza (crear un formateador es costoso).
const formateadorPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** 89900 -> "$ 89.900" */
export function formatearPrecio(valor: number): string {
  return formateadorPesos.format(valor);
}

export type EstadoStock = 'agotado' | 'bajo' | 'normal';

/** Clasifica el stock de un producto para mostrar la etiqueta correcta. */
export function obtenerEstadoStock(stock: number): EstadoStock {
  if (stock === 0) return 'agotado';
  if (stock <= STOCK_MINIMO) return 'bajo';
  return 'normal';
}
```

- **Explicación:** `Intl.NumberFormat` es una API del navegador que formatea números según el país: `es-CO` y `COP` producen `$ 89.900`. `obtenerEstadoStock` concentra la regla de negocio del stock en **un solo lugar**.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** escribir `'es_CO'` con guion bajo → `RangeError: Incorrect locale information`.

### Paso 6 — Componente `Encabezado` (primer componente con props)

- **Archivo:** `Encabezado.tsx`
- **Ruta:** `frontend/src/components/Encabezado.tsx`

```tsx
// Las props son los "parámetros" de un componente. Su forma se describe con una interfaz.
interface EncabezadoProps {
  titulo: string;
  subtitulo: string;
}

export function Encabezado({ titulo, subtitulo }: EncabezadoProps) {
  return (
    <header className="encabezado">
      <div className="encabezado__contenido">
        <div className="encabezado__logo" aria-hidden="true">
          SF
        </div>
        <div>
          <h1 className="encabezado__titulo">{titulo}</h1>
          <p className="encabezado__subtitulo">{subtitulo}</p>
        </div>
      </div>
    </header>
  );
}
```

- **Explicación:** la interfaz `EncabezadoProps` define qué props acepta el componente. `{ titulo, subtitulo }` **desestructura** las props. Las llaves `{titulo}` insertan el valor en el TSX.
- **Resultado esperado:** todavía no se ve; lo usamos en el paso 10.
- **Errores frecuentes:** `class=` en vez de `className=`; nombre del componente en minúscula (`encabezado`), que React trata como una etiqueta HTML desconocida.

### Paso 7 — Componentes `ProductoFila` y `ProductoTabla`

- **Archivo:** `ProductoFila.tsx`
- **Ruta:** `frontend/src/components/ProductoFila.tsx`

```tsx
import type { Producto } from '../types/producto';
import { formatearPrecio, obtenerEstadoStock } from '../utils/formato';

interface ProductoFilaProps {
  producto: Producto;
}

const TEXTO_ESTADO = {
  agotado: 'Agotado',
  bajo: 'Stock bajo',
  normal: 'Disponible',
};

/** Una fila de la tabla: muestra los datos de un producto. */
export function ProductoFila({ producto }: ProductoFilaProps) {
  const estado = obtenerEstadoStock(producto.stock);

  return (
    <tr>
      <td className="celda--codigo">{producto.codigo}</td>
      <td>
        <div className="celda__nombre">{producto.nombre}</div>
        {/* Renderizado condicional: la descripción solo se muestra si existe */}
        {producto.descripcion && <div className="celda__descripcion">{producto.descripcion}</div>}
      </td>
      <td>{producto.categoria}</td>
      <td className="celda--numero">{formatearPrecio(producto.precio)}</td>
      <td className="celda--numero">{producto.stock}</td>
      <td>
        <span className={`etiqueta etiqueta--${estado}`}>{TEXTO_ESTADO[estado]}</span>
      </td>
    </tr>
  );
}
```

- **Archivo:** `ProductoTabla.tsx`
- **Ruta:** `frontend/src/components/ProductoTabla.tsx`

```tsx
import type { Producto } from '../types/producto';
import { ProductoFila } from './ProductoFila';

interface ProductoTablaProps {
  productos: Producto[];
}

/** Tabla de productos. Si la lista está vacía muestra un mensaje. */
export function ProductoTabla({ productos }: ProductoTablaProps) {
  if (productos.length === 0) {
    return <p className="vacio">No hay productos para mostrar.</p>;
  }

  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th className="celda--numero">Precio</th>
            <th className="celda--numero">Stock</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {/* map() convierte cada producto en una fila. La prop key ayuda a React a identificar cada fila. */}
          {productos.map((producto) => (
            <ProductoFila key={producto.id} producto={producto} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- **Explicación:**
  - `ProductoTabla` recibe **toda la lista**; `ProductoFila` recibe **un** producto. Es la relación padre → hijo mediante props.
  - `productos.map(...)` transforma cada objeto en un `<ProductoFila />`.
  - `key={producto.id}` es obligatoria en listas: permite a React saber qué fila cambió, se agregó o se eliminó.
  - `{producto.descripcion && <div>...}` es **renderizado condicional**: si la descripción está vacía, no se dibuja nada.
  - `if (productos.length === 0) return ...` es un **retorno temprano**: muestra otro contenido cuando no hay datos.
  - ``className={`etiqueta etiqueta--${estado}`}`` arma la clase CSS según el estado del stock.
- **Resultado esperado:** sin errores en el editor.
- **Errores frecuentes:**
  - Olvidar la `key` → advertencia en la consola: `Each child in a list should have a unique "key" prop`.
  - Usar `{}` en lugar de `()` en la función flecha del `map`: `productos.map((p) => { <ProductoFila .../> })` no devuelve nada y la tabla queda vacía.

### Paso 8 — Componente `ResumenInventario`

- **Archivo:** `ResumenInventario.tsx`
- **Ruta:** `frontend/src/components/ResumenInventario.tsx`

```tsx
import { STOCK_MINIMO, type Producto } from '../types/producto';
import { formatearPrecio } from '../utils/formato';

interface ResumenInventarioProps {
  productos: Producto[];
}

/** Muestra cuatro indicadores calculados a partir de la lista de productos. */
export function ResumenInventario({ productos }: ResumenInventarioProps) {
  // Valores derivados: se calculan en cada render, no necesitan su propio estado.
  const totalProductos = productos.length;
  const totalUnidades = productos.reduce((suma, producto) => suma + producto.stock, 0);
  const valorInventario = productos.reduce((suma, producto) => suma + producto.precio * producto.stock, 0);
  const productosConStockBajo = productos.filter((producto) => producto.stock <= STOCK_MINIMO).length;

  return (
    <section className="resumen" aria-label="Resumen del inventario">
      <article className="resumen__tarjeta">
        <span className="resumen__etiqueta">Productos</span>
        <strong className="resumen__valor">{totalProductos}</strong>
      </article>
      <article className="resumen__tarjeta">
        <span className="resumen__etiqueta">Unidades en stock</span>
        <strong className="resumen__valor">{totalUnidades}</strong>
      </article>
      <article className="resumen__tarjeta">
        <span className="resumen__etiqueta">Valor del inventario</span>
        <strong className="resumen__valor">{formatearPrecio(valorInventario)}</strong>
      </article>
      <article className={`resumen__tarjeta ${productosConStockBajo > 0 ? 'resumen__tarjeta--alerta' : ''}`}>
        <span className="resumen__etiqueta">Stock bajo (≤ {STOCK_MINIMO})</span>
        <strong className="resumen__valor">{productosConStockBajo}</strong>
      </article>
    </section>
  );
}
```

- **Explicación:** los indicadores son **valores derivados**: se calculan a partir de `productos` en cada render. **No** se guardan en otro estado, porque se desincronizarían. `reduce` acumula una suma y `filter(...).length` cuenta los que cumplen una condición.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** olvidar el valor inicial `0` en `reduce`, que produce resultados incorrectos o errores de tipo.

### Paso 9 — Página `InventarioPage` con estado

- **Archivo:** `InventarioPage.tsx`
- **Ruta:** `frontend/src/pages/InventarioPage.tsx`

```tsx
import { useState } from 'react';
import { ProductoTabla } from '../components/ProductoTabla';
import { ResumenInventario } from '../components/ResumenInventario';
import { productosIniciales } from '../data/productosIniciales';
import { STOCK_MINIMO, type Producto } from '../types/producto';

/**
 * Página principal del inventario (versión de la sesión 1).
 * Guarda el estado y se lo pasa a los componentes hijos mediante props.
 */
export function InventarioPage() {
  // Estado: la lista de productos. Por ahora solo la leemos.
  const [productos] = useState<Producto[]>(productosIniciales);

  // Estado: ¿mostrar solo los productos con stock bajo?
  const [soloStockBajo, setSoloStockBajo] = useState(false);

  // Valor derivado: se recalcula en cada render a partir del estado.
  const productosVisibles = soloStockBajo
    ? productos.filter((producto) => producto.stock <= STOCK_MINIMO)
    : productos;

  return (
    <main className="contenedor">
      <ResumenInventario productos={productos} />

      <section className="panel">
        <div className="panel__cabecera">
          <h2 className="panel__titulo">Productos</h2>
          <button
            type="button"
            className="boton boton--secundario boton--pequeno"
            onClick={() => setSoloStockBajo(!soloStockBajo)}
          >
            {soloStockBajo ? 'Ver todos' : 'Ver solo stock bajo'}
          </button>
        </div>
        <ProductoTabla productos={productosVisibles} />
      </section>
    </main>
  );
}
```

- **Explicación:**
  - `useState<Producto[]>(productosIniciales)` crea un estado con la lista. Por ahora solo leemos `productos` (sin el `set`).
  - `soloStockBajo` es un estado booleano. El botón lo invierte con `setSoloStockBajo(!soloStockBajo)`.
  - `productosVisibles` es un valor derivado: depende de los dos estados.
  - La página **no dibuja filas**: coordina y delega en los componentes. Esta es la **separación de responsabilidades**.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** llamar a `useState` dentro de un `if` o de un ciclo. Los *hooks* siempre van al inicio del componente.

### Paso 10 — `App.tsx` y `main.tsx`

- **Archivo:** `App.tsx`
- **Ruta:** `frontend/src/App.tsx`

```tsx
import { Encabezado } from './components/Encabezado';
import { InventarioPage } from './pages/InventarioPage';

/** Componente raíz: define la estructura general de la aplicación. */
function App() {
  return (
    <>
      <Encabezado titulo="StockFácil" subtitulo="Gestión de inventario para tu negocio" />
      <InventarioPage />
      <footer className="pie">StockFácil · Proyecto del curso Full Stack (React + Express + MongoDB)</footer>
    </>
  );
}

export default App;
```

- **Archivo:** `main.tsx`
- **Ruta:** `frontend/src/main.tsx`

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Punto de entrada: React toma el <div id="root"> de index.html y dibuja <App /> dentro.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- **Explicación:** `main.tsx` es el punto de entrada: busca `#root` y dibuja `<App />`. `StrictMode` activa revisiones adicionales solo en desarrollo. El `!` de `getElementById('root')!` le asegura a TypeScript que el elemento existe. `<>...</>` es un **fragmento**: agrupa elementos sin agregar un `<div>` extra.
- **Resultado esperado:** en `http://localhost:5173` se ve el encabezado verde, cuatro tarjetas de resumen (6 productos, 78 unidades, $ 1.927.000 y 3 con stock bajo) y la tabla con 6 productos. El botón **Ver solo stock bajo** deja 3 filas.
- **Errores frecuentes:**
  - Pantalla en blanco: abrir la consola del navegador (F12) y leer el primer error en rojo.
  - `Failed to resolve import "./App.css"`: quitar esa importación.

### Verificación final de la sesión

```bash
npm run build
```

Si termina sin errores, el proyecto compila correctamente en modo estricto.

---

## 8. Actividad práctica (parejas, 15 min)

1. Agregar **dos productos más** a `productosIniciales.ts`, de categorías distintas, y verificar que el resumen se actualiza solo.
2. Agregar al `Encabezado` una tercera prop opcional `version?: string` y mostrarla solo si existe (por ejemplo `v1.0`).
3. Explicarle al compañero, en voz alta, el recorrido de un producto: `productosIniciales` → `InventarioPage` (estado) → `ProductoTabla` (prop) → `ProductoFila` (prop) → pantalla.

## 9. Reto

Crear un componente `ContadorCategorias` que reciba `productos` y muestre cuántos productos hay por categoría (por ejemplo, *Electrónica: 2 · Papelería: 2 · ...*). Pista: recorrer `CATEGORIAS` con `map` y contar con `filter`.

## 10. Preguntas de comprobación (con respuesta esperada)

1. **¿Qué es una SPA?** Una aplicación que carga una sola página HTML y actualiza su contenido con JavaScript sin recargarla.
2. **¿Cuál es la diferencia entre props y estado?** Las props vienen del padre y son de solo lectura; el estado pertenece al componente y puede cambiar con su función `set`.
3. **¿Por qué `ResumenInventario` no usa `useState` para el total?** Porque es un valor derivado de `productos`; guardarlo aparte podría desincronizarse.
4. **¿Para qué sirve la prop `key`?** Para que React identifique cada elemento de una lista y actualice solo lo necesario.
5. **¿Qué ventaja concreta nos dio TypeScript hoy?** Detectó datos mal escritos, como una categoría inválida o un precio como texto, antes de ejecutar.
6. **¿Qué hace `npm run dev`? ¿Y `npm run build`?** El primero levanta el servidor de desarrollo con recarga instantánea; el segundo verifica los tipos y genera la versión optimizada en `dist/`.

## 11. Evidencia de aprendizaje

- Captura de pantalla de la aplicación con **8 productos** (los 6 iniciales y los 2 de la actividad) y el resumen correcto.
- Captura de `npm run build` terminado sin errores.
- Commit en Git: `git commit -m "Sesión 1: componentes, props y estado inicial"`.

## 12. Tarea (autónoma, ~1,5 h)

1. Leer la documentación oficial "Pensar en React" (react.dev) y relacionarla con cómo dividimos StockFácil.
2. Inicializar Git en `proyecto-fullstack/` (`git init`) y hacer el commit de la sesión.
3. **Preparación para la sesión 2:** repasar eventos del DOM (`click`, `submit`, `change`) y el operador *spread* (`{ ...objeto }`, `[...arreglo]`).
