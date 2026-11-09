# Sesión 6 — Integración Frontend + Backend

> **Proyecto:** StockFácil · **Bloque:** Backend (3 de 3) · **Duración:** 120 minutos
> **Punto de partida:** frontend con servicio HTTP listo (sesión 3) y API CRUD en memoria (sesión 5).
> **Al terminar la sesión:** **React y Express funcionan integrados.** Cada acción del usuario (listar, crear, editar, eliminar y ajustar stock) viaja por HTTP hasta la API y la interfaz se actualiza con la respuesta del servidor.

---

## 1. Objetivo de aprendizaje

Al finalizar la sesión, el estudiante será capaz de **conectar una aplicación React con una API Express** y de **rastrear una operación de extremo a extremo**, desde el clic del usuario hasta la respuesta JSON, usando las herramientas de desarrollador para diagnosticar errores de red, CORS y validación.

## 2. Competencias

| Tipo | Competencia |
|------|-------------|
| Conceptual | Explica el modelo cliente-servidor y el recorrido completo de una petición a través de las capas. |
| Conceptual | Explica por qué el estado de React debe actualizarse con la **respuesta del servidor** y no con los datos enviados. |
| Procedimental | Reemplaza la lógica local por llamadas al servicio HTTP con `async/await`, estados de "guardando" y manejo de errores. |
| Procedimental | Diagnostica fallas con la pestaña *Network*, la consola del navegador y la terminal del backend. |
| Actitudinal | Aplica un método sistemático de depuración: "¿salió la petición? ¿llegó? ¿qué respondió?". |

## 3. Conceptos previos

- Sesión 3: `fetch`, `useEffect`, estados de carga y error, `productoService.ts`.
- Sesión 4: CORS y variables de entorno.
- Sesión 5: endpoints, códigos de estado y formato de error `{ mensaje, errores }`.

---

## 4. Teoría

### 4.1 Modelo cliente-servidor

- **Qué es:** una arquitectura en la que un **cliente** (el navegador con React) solicita servicios a un **servidor** (Express), que procesa y responde. Se comunican solo mediante mensajes (HTTP/JSON).
- **Para qué sirve:** para separar la **presentación** (cliente) de los **datos y las reglas** (servidor).
- **Por qué se utiliza:** los datos quedan centralizados y protegidos; muchos clientes (web, móvil) pueden usar el mismo servidor; y cada parte se desarrolla y despliega por separado.
- **Ejemplo sencillo:** una app bancaria. Tu celular (cliente) nunca toca la base de datos del banco: le **pide** al servidor tu saldo.
- **Aplicación en el proyecto:**

```
Usuario
  │  clic en "Agregar producto"
  ▼
React  (ProductoFormulario → valida → onGuardar(datos))
  │  InventarioPage.guardarProducto → productoService.crearProducto(datos)
  ▼
HTTP   POST http://localhost:3000/api/productos
       Content-Type: application/json
       {"codigo":"PAP-010","nombre":"Cuaderno argollado",...}
  ▼
Express  registrarPeticiones → cors → express.json → productoRouter
  │      → validarProductoCompleto (si falla: 400)
  ▼
Controller  crearProducto(req, res) → productoService.crearProducto(req.body)
  │         (servicio: código repetido → 409; si no, guarda con id y fechas)
  ▼
Respuesta JSON  201 Created  {"id":"7c1e...","codigo":"PAP-010",...,"createdAt":"..."}
  ▼
React  setProductos([creado, ...anteriores]) → se redibuja la tabla
       setMensaje("Producto agregado") → aparece la alerta verde
```

### 4.2 La respuesta del servidor es la fuente de verdad

- **Qué es:** después de guardar, el frontend actualiza su estado con **lo que devolvió el servidor**, no con lo que envió.
- **Para qué sirve:** el servidor agrega o transforma datos: genera el `id` y las fechas, y convierte el código a mayúsculas.
- **Por qué se utiliza:** si usáramos los datos enviados, la interfaz mostraría algo distinto de lo guardado (por ejemplo, sin `id`, y no podríamos editar el producto).
- **Ejemplo sencillo:** enviamos `codigo: "pap-010"` y el servidor devuelve `"PAP-010"`. La tabla muestra `PAP-010`.
- **Aplicación en el proyecto:** `const creado = await productoService.crearProducto(datos); setProductos([creado, ...])`.

### 4.3 Actualización pesimista vs optimista

| Estrategia | Cómo funciona | Ventaja | Desventaja |
|------------|---------------|---------|------------|
| **Pesimista** (la que usamos) | Primero se espera la respuesta del servidor; si es exitosa, se actualiza la interfaz | Simple y siempre coherente con el servidor | El usuario espera un instante |
| **Optimista** | Se actualiza la interfaz de inmediato y se revierte si el servidor falla | Se siente instantánea | Más compleja: hay que deshacer cambios |

Para aprender, la **pesimista** es la correcta. La optimista se deja como tema avanzado.

### 4.4 CORS en la práctica y la petición *preflight*

- **Qué es:** para las peticiones "no simples" (por ejemplo, con `Content-Type: application/json`, o con PUT, PATCH o DELETE), el navegador envía **antes** una petición automática `OPTIONS` (*preflight*) para preguntar al servidor si la operación está permitida.
- **Para qué sirve:** el servidor responde con los métodos y encabezados que acepta, y solo si la respuesta es afirmativa el navegador envía la petición real.
- **Por qué importa:** en la pestaña *Network* verás parejas `OPTIONS` + `POST`. No es un error. El middleware `cors()` responde el `OPTIONS` automáticamente.
- **Aplicación en el proyecto:** por eso `solicitar()` solo agrega `Content-Type` cuando hay cuerpo: los GET quedan como peticiones simples, **sin** *preflight*.

### 4.5 Método de depuración de extremo a extremo

Cuando "no funciona", responder **en orden**:

| # | Pregunta | Dónde mirarlo |
|---|----------|---------------|
| 1 | ¿Hay errores de JavaScript? | Consola del navegador (F12) |
| 2 | ¿Salió la petición? ¿Con qué método, URL y cuerpo? | *Network* → la petición → *Headers* y *Payload* |
| 3 | ¿Llegó al servidor? | Terminal del backend (línea de `registrarPeticiones`) |
| 4 | ¿Qué respondió? | *Network* → *Response*, y el status |
| 5 | ¿La interfaz usó bien la respuesta? | React DevTools → estado de `InventarioPage` |

| Síntoma | Causa probable |
|---------|----------------|
| *"No se pudo conectar con el servidor"* | Backend apagado o `VITE_API_URL` incorrecta |
| Error de CORS en la consola | `CORS_ORIGIN` no coincide con la URL del frontend |
| 404 en todas las peticiones | Falta `/api` en `VITE_API_URL` o hay una ruta mal escrita |
| 400 con lista de errores | Datos inválidos; revisar el cuerpo enviado en *Payload* |
| La petición no aparece en *Network* | La función no se llamó (revisar el evento o el callback) |

**Buenas prácticas que aparecen hoy:** la interfaz usa la respuesta del servidor como fuente de verdad; se evitan envíos dobles (botón deshabilitado mientras se guarda); los mensajes de error del servidor se muestran al usuario; y se elimina el código temporal (datos de demostración).

---

## 5. Distribución de los 120 minutos

| Tiempo | Actividad | Descripción |
|--------|-----------|-------------|
| 0 – 10 min | Introducción | Las dos mitades están listas: hoy se unen. Encender los dos servidores. |
| 10 – 30 min | Teoría | Cliente-servidor, recorrido completo, fuente de verdad, preflight y método de depuración. |
| 30 – 50 min | Demostración | Conectar solo la **carga inicial** (GET) y rastrearla con las tres herramientas. |
| 50 – 90 min | Desarrollo guiado | Crear, editar, eliminar y stock contra la API; limpiar el código de demostración. |
| 90 – 110 min | Taller | "Detectives del error": diagnosticar fallas provocadas. |
| 110 – 120 min | Cierre | Reiniciar el backend y observar que los datos se pierden. Preguntas y tarea. |

---

## 6. Libreto del docente

### 0 – 10 min · Introducción

> **Docente:** "Tenemos un frontend que sabe **pedir** y un backend que sabe **responder**. Hoy los presentamos."

Pedir que abran **dos terminales**:

```bash
# Terminal 1
cd backend && npm run dev
# Terminal 2
cd frontend && npm run dev
```

> **Pregunta:** *"¿Qué URL tiene cada uno? ¿Por qué son orígenes distintos?"* (Puertos 5173 y 3000; distinto puerto = distinto origen = CORS.)

### 10 – 30 min · Teoría

- **Recorrido completo (10 min):** dibujar en el tablero el diagrama 4.1 **paso a paso**, preguntando en cada flecha: *"¿Qué archivo de nuestro proyecto hace esto?"* Los estudiantes deben nombrarlos (`ProductoFormulario.tsx`, `productoService.ts`, `producto.routes.ts`...).
- **Fuente de verdad (4 min):**
  > **Pregunta:** *"Si enviamos el producto sin id, ¿de dónde sale el id que necesitamos para editarlo después?"* (De la respuesta del servidor.)
- **Preflight (3 min):** anticipar que verán `OPTIONS` en *Network*.
- **Método de depuración (3 min):** presentar la tabla 4.5 como la herramienta del taller.

### 30 – 50 min · Demostración

1. Verificar `frontend/.env` → `VITE_API_URL=http://localhost:3000/api`.
2. En `InventarioPage` (versión de la sesión 3), cambiar **solo** `obtenerProductosDemo()` por `productoService.obtenerProductos()` y recargar.
3. Rastrear la petición con el método de 4.5: *Network* (GET 200 a `localhost:3000`), la terminal del backend (`GET /api/productos -> 200`) y React DevTools (el estado `productos` tiene 6 elementos con ids UUID).
   > **Pregunta:** *"Creen un producto y recarguen. ¿Qué pasó?"* Se pierde, porque crear todavía es local. *"¿Qué falta?"* Conectar las demás operaciones.

### 50 – 90 min · Desarrollo guiado

- Pasos 1 a 5.
- **Momento de interacción (paso 2):** *"¿Por qué el botón dice 'Guardando...' y se deshabilita?"* Para evitar el doble clic, que crearía dos productos (POST no es idempotente).
- **Momento de interacción (paso 3):** comparar lado a lado `guardarProducto` de la sesión 2 con la nueva versión. ¿Qué desapareció? (La verificación del código repetido: ahora la hace el servidor.) ¿Qué apareció? (`async`, `try/catch/finally`, `guardando`.)

### 90 – 110 min · Taller "Detectives del error"

El docente (o las parejas entre sí) provoca estas fallas **sin decir cuál es**; el equipo la diagnostica con la tabla 4.5 y la corrige:

1. Apagar el backend.
2. Cambiar `VITE_API_URL` a `http://localhost:3000` (sin `/api`) y reiniciar Vite.
3. Cambiar `CORS_ORIGIN` a `http://localhost:5174` y reiniciar el backend.
4. En `ProductoFormulario`, comentar temporalmente la línea `return;` que detiene el envío cuando hay errores, y enviar el formulario vacío: ahora responde la **validación del servidor** (400 con la lista de errores en la alerta).
5. En `productoService.ts`, cambiar `method: 'PATCH'` por `method: 'PUT'` y pulsar **+** en una fila.

### 110 – 120 min · Cierre

1. Crear dos productos desde la interfaz.
2. **Reiniciar el backend** (`Ctrl + C` y `npm run dev`) y recargar el navegador.
   > **Pregunta:** *"¿Dónde están los productos que creamos?"* Se perdieron: vivían en la **memoria** del servidor.
   > "La próxima sesión llega la última pieza: **MongoDB**, para que los datos sobrevivan a los reinicios."

---

## 7. Desarrollo práctico

### Paso 1 — Verificar la configuración de ambos lados

- **Archivos:** `frontend/.env` y `backend/.env`

```bash
# frontend/.env
VITE_API_URL=http://localhost:3000/api

# backend/.env
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

- **Explicación:** la URL del frontend debe apuntar exactamente al puerto y al prefijo del backend, y el backend debe autorizar exactamente el origen del frontend.
- **Resultado esperado:** con ambos servidores encendidos, desde la consola del navegador en `localhost:5173`:
  ```js
  await (await fetch('http://localhost:3000/api/salud')).json()   // { estado: 'ok', ... }
  ```
- **Errores frecuentes:** usar `127.0.0.1:5173` en el navegador en lugar de `localhost:5173`. Para el navegador son **orígenes distintos**, así que CORS lo bloquea. Solución: abrir `localhost`, o agregar ambos a `CORS_ORIGIN` separados por coma.

### Paso 2 — Formulario asíncrono con estado "guardando"

- **Archivo:** `ProductoFormulario.tsx` (versión final)
- **Ruta:** `frontend/src/components/ProductoFormulario.tsx`

```tsx
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { CATEGORIAS, type Producto, type ProductoDatos } from '../types/producto';
import {
  VALORES_INICIALES,
  convertirAProductoDatos,
  validarFormulario,
  type ErroresFormulario,
  type ValoresFormulario,
} from '../utils/validarProducto';

interface ProductoFormularioProps {
  /** null = crear un producto nuevo; un producto = editar ese producto */
  productoInicial: Producto | null;
  guardando: boolean;
  /** Devuelve true si se guardó correctamente */
  onGuardar: (datos: ProductoDatos) => Promise<boolean>;
  onCancelar: () => void;
}

/** Convierte un producto (números) en valores del formulario (texto). */
function obtenerValoresIniciales(producto: Producto | null): ValoresFormulario {
  if (!producto) return VALORES_INICIALES;
  return {
    codigo: producto.codigo,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    categoria: producto.categoria,
    precio: String(producto.precio),
    stock: String(producto.stock),
  };
}

/**
 * Formulario para crear o editar un producto.
 * Todos los inputs son CONTROLADOS: su valor vive en el estado `valores`.
 */
export function ProductoFormulario({ productoInicial, guardando, onGuardar, onCancelar }: ProductoFormularioProps) {
  const [valores, setValores] = useState<ValoresFormulario>(() => obtenerValoresIniciales(productoInicial));
  const [errores, setErrores] = useState<ErroresFormulario>({});

  const esEdicion = productoInicial !== null;

  // Un solo manejador para todos los campos: usa el atributo "name" del input.
  function manejarCambio(evento: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = evento.target;
    setValores({ ...valores, [name]: value }); // copiamos el objeto y cambiamos un campo
    setErrores({ ...errores, [name]: undefined }); // borramos el error del campo que se está corrigiendo
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); // evita que el navegador recargue la página

    const erroresEncontrados = validarFormulario(valores);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) {
      return; // hay errores: no enviamos nada
    }

    const guardadoCorrectamente = await onGuardar(convertirAProductoDatos(valores));
    if (guardadoCorrectamente && !esEdicion) {
      setValores(VALORES_INICIALES); // limpiamos el formulario después de crear
    }
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio} noValidate>
      <h2 className="panel__titulo">{esEdicion ? `Editar ${productoInicial.codigo}` : 'Nuevo producto'}</h2>

      <div className="formulario__fila">
        <div className="campo">
          <label htmlFor="codigo" className="campo__etiqueta">Código *</label>
          <input
            id="codigo"
            name="codigo"
            className={`campo__control ${errores.codigo ? 'campo__control--error' : ''}`}
            placeholder="PAP-010"
            value={valores.codigo}
            onChange={manejarCambio}
          />
          {errores.codigo && <span className="campo__error">{errores.codigo}</span>}
        </div>

        <div className="campo">
          <label htmlFor="categoria" className="campo__etiqueta">Categoría *</label>
          <select
            id="categoria"
            name="categoria"
            className={`campo__control ${errores.categoria ? 'campo__control--error' : ''}`}
            value={valores.categoria}
            onChange={manejarCambio}
          >
            <option value="">Selecciona...</option>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
          {errores.categoria && <span className="campo__error">{errores.categoria}</span>}
        </div>
      </div>

      <div className="campo">
        <label htmlFor="nombre" className="campo__etiqueta">Nombre *</label>
        <input
          id="nombre"
          name="nombre"
          className={`campo__control ${errores.nombre ? 'campo__control--error' : ''}`}
          placeholder="Cuaderno argollado 80 hojas"
          value={valores.nombre}
          onChange={manejarCambio}
        />
        {errores.nombre && <span className="campo__error">{errores.nombre}</span>}
      </div>

      <div className="formulario__fila">
        <div className="campo">
          <label htmlFor="precio" className="campo__etiqueta">Precio (COP) *</label>
          <input
            id="precio"
            name="precio"
            type="number"
            min="0"
            step="any"
            className={`campo__control ${errores.precio ? 'campo__control--error' : ''}`}
            placeholder="5900"
            value={valores.precio}
            onChange={manejarCambio}
          />
          {errores.precio && <span className="campo__error">{errores.precio}</span>}
        </div>

        <div className="campo">
          <label htmlFor="stock" className="campo__etiqueta">Stock *</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            className={`campo__control ${errores.stock ? 'campo__control--error' : ''}`}
            placeholder="10"
            value={valores.stock}
            onChange={manejarCambio}
          />
          {errores.stock && <span className="campo__error">{errores.stock}</span>}
        </div>
      </div>

      <div className="campo">
        <label htmlFor="descripcion" className="campo__etiqueta">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          className={`campo__control ${errores.descripcion ? 'campo__control--error' : ''}`}
          placeholder="Detalles opcionales del producto"
          value={valores.descripcion}
          onChange={manejarCambio}
        />
        <span className="campo__ayuda">{valores.descripcion.length}/300</span>
        {errores.descripcion && <span className="campo__error">{errores.descripcion}</span>}
      </div>

      <div className="formulario__botones">
        <button type="submit" className="boton boton--primario" disabled={guardando}>
          {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Agregar producto'}
        </button>
        {esEdicion && (
          <button type="button" className="boton boton--secundario" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
```

- **Explicación de los cambios frente a la sesión 2:**
  - `onGuardar` ahora devuelve `Promise<boolean>`, porque guardar tarda (va al servidor).
  - `manejarEnvio` es `async` y hace `await onGuardar(...)`. El formulario solo se limpia si el servidor confirmó que se guardó.
  - Nueva prop `guardando`: deshabilita los botones y cambia el texto a *"Guardando..."*.
- **Resultado esperado:** TypeScript marca un error en `InventarioPage` hasta completar el paso 3.
- **Errores frecuentes:** olvidar `await` → `guardadoCorrectamente` sería una Promesa (siempre "verdadera") y el formulario se limpiaría aunque el servidor respondiera error.

### Paso 3 — `InventarioPage` conectada a la API

- **Archivo:** `InventarioPage.tsx` (versión final)
- **Ruta:** `frontend/src/pages/InventarioPage.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Alerta, type MensajeAlerta } from '../components/Alerta';
import { BarraFiltros, type FiltroCategoria } from '../components/BarraFiltros';
import { Cargando } from '../components/Cargando';
import { ProductoFormulario } from '../components/ProductoFormulario';
import { ProductoTabla } from '../components/ProductoTabla';
import { ResumenInventario } from '../components/ResumenInventario';
import { ApiError, obtenerMensajeDeError } from '../services/api';
import * as productoService from '../services/productoService';
import type { Producto, ProductoDatos } from '../types/producto';

/**
 * Página principal del inventario.
 * Guarda el ESTADO de la pantalla y coordina a los componentes hijos:
 *   - los hijos reciben datos por props,
 *   - y avisan de las acciones del usuario con funciones (onGuardar, onEliminar...).
 */
export function InventarioPage() {
  // ---------- Estado ----------
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorDeCarga, setErrorDeCarga] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<MensajeAlerta | null>(null);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<FiltroCategoria>('Todas');
  const [intentoDeCarga, setIntentoDeCarga] = useState(0);

  // ---------- Carga de productos (GET) ----------
  // El efecto se ejecuta al mostrar la página y cada vez que cambia `intentoDeCarga`.
  useEffect(() => {
    let cancelado = false;

    async function cargarProductos() {
      try {
        const datos = await productoService.obtenerProductos();
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

  // ---------- Utilidades ----------
  function mostrarError(error: unknown) {
    setMensaje({
      tipo: 'error',
      texto: obtenerMensajeDeError(error),
      detalles: error instanceof ApiError ? error.errores : undefined,
    });
  }

  /** Reemplaza en la lista el producto que devolvió el servidor. */
  function reemplazarEnLista(productoActualizado: Producto) {
    setProductos((anteriores) =>
      anteriores.map((producto) => (producto.id === productoActualizado.id ? productoActualizado : producto)),
    );
  }

  // ---------- Crear y editar (POST / PUT) ----------
  function iniciarEdicion(producto: Producto) {
    setMensaje(null);
    setProductoEditando(producto);
  }

  async function guardarProducto(datos: ProductoDatos): Promise<boolean> {
    setGuardando(true);
    setMensaje(null);
    try {
      if (productoEditando) {
        const actualizado = await productoService.actualizarProducto(productoEditando.id, datos);
        reemplazarEnLista(actualizado);
        setProductoEditando(null);
        setMensaje({ tipo: 'exito', texto: `Producto "${actualizado.nombre}" actualizado.` });
      } else {
        const creado = await productoService.crearProducto(datos);
        setProductos((anteriores) => [creado, ...anteriores]);
        setMensaje({ tipo: 'exito', texto: `Producto "${creado.nombre}" agregado al inventario.` });
      }
      return true;
    } catch (error) {
      mostrarError(error);
      return false;
    } finally {
      setGuardando(false);
    }
  }

  // ---------- Eliminar (DELETE) ----------
  async function eliminarProducto(producto: Producto) {
    const confirmado = window.confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    setMensaje(null);
    try {
      await productoService.eliminarProducto(producto.id);
      setProductos((anteriores) => anteriores.filter((item) => item.id !== producto.id));
      if (productoEditando?.id === producto.id) {
        setProductoEditando(null);
      }
      setMensaje({ tipo: 'exito', texto: `Producto "${producto.nombre}" eliminado.` });
    } catch (error) {
      mostrarError(error);
    }
  }

  // ---------- Ajustar stock (PATCH) ----------
  async function cambiarStock(producto: Producto, cantidad: number) {
    const nuevoStock = producto.stock + cantidad;
    if (nuevoStock < 0) return;

    try {
      const actualizado = await productoService.actualizarProductoParcial(producto.id, { stock: nuevoStock });
      reemplazarEnLista(actualizado);
    } catch (error) {
      mostrarError(error);
    }
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
              guardando={guardando}
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
  - **Carga:** el efecto ahora llama a `productoService.obtenerProductos()` (GET).
  - **Crear/editar:** `guardarProducto` es `async`. Según `productoEditando`, llama a `crearProducto` (POST) o a `actualizarProducto` (PUT). El estado se actualiza con la **respuesta**. `finally` apaga `guardando` siempre.
  - **Código repetido:** ya no se verifica aquí. Si el servidor responde 409, `mostrarError` muestra su mensaje.
  - **Eliminar:** llama a `eliminarProducto` (DELETE, 204) y, **solo si tuvo éxito**, quita el producto del estado.
  - **Stock:** `cambiarStock` usa `actualizarProductoParcial` (PATCH) enviando únicamente `{ stock }`.
  - `mostrarError` aprovecha `ApiError.errores` para listar los detalles de validación del servidor.
  - `setProductos((anteriores) => ...)` usa la **forma funcional** del `set`: calcula el nuevo estado a partir del **más reciente**. Es lo recomendado cuando la actualización ocurre después de un `await`.
- **Resultado esperado:**

  | Acción | En *Network* | En la terminal del backend |
  |--------|--------------|----------------------------|
  | Abrir la app | `GET /api/productos` 200 | `GET /api/productos -> 200` |
  | Crear | `OPTIONS` 204 + `POST` **201** | `POST /api/productos -> 201` |
  | Crear con código repetido | `POST` **409** y alerta roja | `-> 409` |
  | Editar y guardar | `PUT` 200 | `PUT /api/productos/<id> -> 200` |
  | Botón + | `PATCH` 200, cuerpo `{"stock":13}` | `PATCH ... -> 200` |
  | Eliminar | `DELETE` **204** | `DELETE ... -> 204` |

- **Errores frecuentes:**
  - `setProductos([...productos, creado])` usando la variable del render anterior. Puede perder cambios si ocurren dos actualizaciones seguidas; se usa la forma funcional.
  - Actualizar el estado **antes** del `await` (optimista) sin manejar el error: la interfaz muestra algo que el servidor rechazó.

### Paso 4 — Eliminar el código de demostración

- **Archivo:** `productoService.ts` (versión final, sin `obtenerProductosDemo`)
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
```

Además, borrar:

```bash
# dentro de frontend/
rm public/productos-demo.json
rm -r src/data            # productosIniciales.ts ya no se usa
```

- **Explicación:** el código muerto confunde a quien lee el proyecto después. **Buena práctica:** eliminar lo temporal cuando cumplió su función (Git conserva la historia si se necesita).
- **Resultado esperado:** `npm run build` en `frontend/` termina sin errores.
- **Errores frecuentes:** borrar `src/data` mientras algún archivo lo importa → `Failed to resolve import`. Buscar referencias con `Ctrl + Shift + F` → `productosIniciales`.

### Paso 5 — Verificación integral

Con ambos servidores encendidos, ejecutar el guion completo: crear `pap-010` → aparece como `PAP-010` con *Stock bajo* → editar el nombre → +1 hasta 6 (cambia a *Disponible*) → buscar → eliminar. Revisar que **cada** acción tiene su petición en *Network* y su línea en la terminal del backend.

---

## 8. Actividad práctica (parejas, 15 min)

1. Elegir una operación (crear, editar, stock o eliminar) y dibujar su recorrido completo como el del apartado 4.1, con los **nombres reales** de archivos y funciones, y adjuntar la captura de *Network* (*Headers*, *Payload* y *Response*).
2. Desde Thunder Client, crear un producto directamente en la API y luego pulsar **Reintentar** o recargar el frontend. ¿Aparece? ¿Por qué? (Ambos clientes comparten el mismo servidor.)

## 9. Reto

Mientras se cambia el stock de un producto, deshabilitar **solo** los botones +/- de esa fila, para evitar clics repetidos antes de que llegue la respuesta. Pista: un estado `idActualizandoStock: string | null` en la página y una nueva prop `actualizando` en `ProductoFila`.

## 10. Preguntas de comprobación (con respuesta esperada)

1. **Describe el recorrido de un clic en "Eliminar" hasta que la fila desaparece.** `ProductoFila` → `onEliminar` → `InventarioPage.eliminarProducto` → confirm → `productoService.eliminarProducto` → `DELETE /api/productos/:id` → router → controlador → servicio (splice) → 204 → `setProductos(filter)` → re-render.
2. **¿Por qué la tabla usa el producto que devuelve el servidor y no el que enviamos?** Porque el servidor genera el id y las fechas y normaliza datos (código en mayúsculas): es la fuente de verdad.
3. **¿Qué es la petición `OPTIONS` que aparece antes del `POST`?** El *preflight* de CORS: el navegador pregunta si el método y los encabezados están permitidos.
4. **¿Por qué el botón se deshabilita mientras se guarda?** Para evitar envíos dobles: POST no es idempotente y crearía duplicados.
5. **El frontend dice "No se pudo conectar con el servidor". ¿Qué revisas primero?** Que el backend esté encendido y que `VITE_API_URL` sea correcta (puerto y `/api`).
6. **¿Por qué se pierden los datos al reiniciar el backend?** Porque se guardan en un arreglo en la memoria del proceso de Node.

## 11. Evidencia de aprendizaje

- Diagrama del recorrido (actividad 1) con capturas de *Network*.
- Reporte del taller "Detectives del error": para cada falla, **síntoma → diagnóstico → corrección**.
- Commit: `git commit -m "Sesión 6: integración React + Express"`.

## 12. Tarea (autónoma, ~1,5 h)

1. Completar el reto.
2. **Instalar para la sesión 7** (obligatorio, lleva tiempo):
   - **Opción A (recomendada):** MongoDB Community Server + MongoDB Compass (mongodb.com → *Products* → *Community Server*). En Windows, marcar "Install MongoDB as a Service".
   - **Opción B:** crear una cuenta gratuita en **MongoDB Atlas** y un clúster *Free* (M0).
   - Verificar abriendo Compass y conectando a `mongodb://127.0.0.1:27017` (opción A) o a la cadena de Atlas (opción B).
3. Leer: "What is NoSQL?" en la documentación de MongoDB.
