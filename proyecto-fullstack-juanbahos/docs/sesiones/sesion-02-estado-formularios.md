# Sesión 2 — Componentes, estado y formularios

> **Proyecto:** StockFácil · **Bloque:** Frontend (2 de 3) · **Duración:** 120 minutos
> **Punto de partida:** proyecto de la sesión 1 (tabla, resumen y estado inicial).
> **Al terminar la sesión:** se pueden **crear, editar, eliminar, buscar, filtrar** productos y **ajustar su stock**. Todo ocurre en el estado de React; al recargar la página, los cambios se pierden.

---

## 1. Objetivo de aprendizaje

Al finalizar la sesión, el estudiante será capaz de **implementar un CRUD en el estado de React**, usando formularios con inputs controlados, validaciones, eventos y comunicación entre componentes mediante props de tipo función.

## 2. Competencias

| Tipo | Competencia |
|------|-------------|
| Conceptual | Explica el flujo de datos unidireccional: los datos bajan por props y los eventos suben por funciones (*callbacks*). |
| Conceptual | Distingue entre estado y valores derivados, y explica por qué el estado se actualiza de forma inmutable. |
| Procedimental | Construye formularios con inputs controlados, validación por campo y mensajes de error. |
| Procedimental | Maneja eventos (`onClick`, `onChange`, `onSubmit`) y aplica renderizado condicional. |
| Actitudinal | Diseña pensando en el usuario: mensajes claros, confirmación antes de borrar y botones deshabilitados cuando no aplican. |

## 3. Conceptos previos

- Sesión 1: componentes, props, `useState`, `map`, `key`.
- JavaScript: operador *spread* (`{ ...obj }`, `[...arr]`), `filter`, `map`, `some`, `Number()`, `trim()`.
- HTML: `<form>`, `<input>`, `<select>`, `<textarea>`, `<label for>`.

---

## 4. Teoría

### 4.1 Componentes reutilizables

- **Qué es:** un componente que no depende de un caso particular: recibe **todo** lo que necesita por props.
- **Para qué sirve:** para usar la misma pieza en varios lugares o situaciones.
- **Por qué se utiliza:** reduce el código duplicado y los errores; si se corrige el componente, se corrige en todos los lugares donde se usa.
- **Ejemplo sencillo:** un `<Alerta>` que sirve tanto para éxito como para error, según la prop `tipo`.
- **Aplicación en el proyecto:** `ProductoFormulario` sirve para **crear** y para **editar**: si recibe `productoInicial = null` crea; si recibe un producto, edita.

### 4.2 Props de tipo función (callbacks)

- **Qué es:** una prop cuyo valor es una **función**. El hijo la llama para avisarle algo al padre.
- **Para qué sirve:** para que los eventos **suban** del hijo al padre, que es quien tiene el estado.
- **Por qué se utiliza:** en React los datos fluyen **en una sola dirección** (de padre a hijo). Para que un hijo modifique el estado del padre, el padre le entrega una función.
- **Ejemplo sencillo:**
  ```tsx
  <BotonEliminar onEliminar={() => console.log('borrar')} />
  function BotonEliminar({ onEliminar }: { onEliminar: () => void }) {
    return <button onClick={onEliminar}>Eliminar</button>;
  }
  ```
- **Aplicación en el proyecto:**
  ```
  InventarioPage (tiene el estado)
     │ productos ↓            ↑ onEliminar(producto)
  ProductoTabla
     │ producto ↓             ↑ onEliminar(producto)
  ProductoFila → <button onClick={() => onEliminar(producto)}>
  ```
  **Convención:** las props que son eventos empiezan con `on` (`onGuardar`, `onEditar`); las funciones que los manejan tienen un verbo (`guardarProducto`, `eliminarProducto`).

### 4.3 `useState` a fondo: actualización inmutable

- **Qué es:** actualizar el estado creando un **objeto o arreglo nuevo**, en lugar de modificar el existente.
- **Para qué sirve:** React compara la referencia anterior con la nueva. Si es el **mismo** arreglo, aunque tenga otro contenido, React cree que nada cambió y no redibuja.
- **Por qué se utiliza:** hace los cambios predecibles y permite a React optimizar.
- **Ejemplo sencillo:**
  ```ts
  productos.push(nuevo);              // ❌ modifica el mismo arreglo: la pantalla no cambia
  setProductos([nuevo, ...productos]); // ✅ arreglo nuevo
  ```

  | Operación | Forma inmutable |
  |-----------|-----------------|
  | Agregar | `[nuevo, ...lista]` |
  | Eliminar | `lista.filter(p => p.id !== id)` |
  | Modificar | `lista.map(p => p.id === id ? { ...p, stock: 3 } : p)` |

- **Aplicación en el proyecto:** las tres operaciones del CRUD en `InventarioPage` siguen esta tabla.

### 4.4 Eventos

- **Qué es:** acciones del usuario (clic, escribir, enviar) a las que el código responde.
- **Para qué sirve:** para ejecutar una función cuando ocurre la acción.
- **Por qué se utiliza:** es la forma de conectar la interacción del usuario con el estado.
- **Ejemplo sencillo:** `<button onClick={() => setContador(contador + 1)}>+</button>`
- **Error clásico:** `onClick={eliminar(producto)}` **ejecuta** la función al dibujar. Lo correcto es `onClick={() => eliminar(producto)}`, que le **entrega** una función a React para que la ejecute en el clic.
- **Aplicación en el proyecto:** `onClick` en Editar, Eliminar y +/-; `onChange` en los inputs; `onSubmit` en el formulario.

### 4.5 Formularios e inputs controlados

- **Qué es:** un input **controlado** es aquel cuyo valor viene del estado (`value={valores.nombre}`) y se actualiza con `onChange`.
- **Para qué sirve:** React se convierte en la "única fuente de verdad" del formulario. Así podemos validar, limpiar o precargar valores fácilmente.
- **Por qué se utiliza:** sin control, el valor vive en el DOM y es difícil leerlo, validarlo o reiniciarlo.
- **Ejemplo sencillo:**
  ```tsx
  const [nombre, setNombre] = useState('');
  <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
  ```
- **`preventDefault()`:** por defecto, un `<form>` recarga la página al enviarse. `evento.preventDefault()` lo evita.
- **Aplicación en el proyecto:** `ProductoFormulario` guarda todos los campos en un único objeto `valores` y usa **un solo manejador** (`manejarCambio`) basado en el atributo `name` de cada input.

### 4.6 Validaciones en el cliente

- **Qué es:** comprobar los datos **antes** de enviarlos o guardarlos.
- **Para qué sirve:** para dar **retroalimentación inmediata** al usuario, junto al campo con problemas.
- **Por qué se utiliza:** mejora la experiencia de uso. **Ojo:** no reemplaza la validación en el servidor (sesión 5), porque cualquiera puede saltarse el frontend.
- **Ejemplo sencillo:** `if (nombre.trim().length < 3) errores.nombre = 'Mínimo 3 caracteres';`
- **Aplicación en el proyecto:** `utils/validarProducto.ts` devuelve un objeto `{ campo: mensaje }`; el formulario muestra cada mensaje debajo de su campo.

### 4.7 Listados

- **Qué es:** transformar un arreglo de datos en un arreglo de elementos con `map`.
- **Para qué sirve:** para mostrar colecciones de tamaño variable.
- **Por qué se utiliza:** los datos cambian (se agregan y se borran) y la interfaz debe reflejarlo sin escribir cada fila a mano.
- **Ejemplo sencillo:** `{CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}`
- **Aplicación en el proyecto:** filas de la tabla, opciones de categoría y lista de errores de la alerta.

### 4.8 Renderizado condicional

- **Qué es:** mostrar u ocultar elementos según una condición.
- **Para qué sirve:** para adaptar la interfaz al estado: modo edición, mensajes y listas vacías.
- **Por qué se utiliza:** la misma pantalla tiene distintos "modos" según los datos.
- **Tres formas:**

  | Forma | Cuándo usarla | Ejemplo en el proyecto |
  |-------|---------------|------------------------|
  | `condicion && <X />` | Mostrar o no mostrar | `{mensaje && <Alerta ... />}` |
  | `condicion ? <A /> : <B />` | Elegir entre dos | Título "Editar" o "Nuevo producto" |
  | `if (...) return ...` | Casos completos distintos | Tabla vacía en `ProductoTabla` |

### 4.9 Interfaces TypeScript para props y formularios

- **Qué es:** describir con `interface` o `type` la forma de las props, del estado y de las funciones.
- **Para qué sirve:** el editor avisa si falta una prop, si sobra una o si se pasa una función con la firma equivocada.
- **Por qué se utiliza:** los errores de comunicación entre componentes son los más comunes en React.
- **Ejemplo sencillo:** `onGuardar: (datos: ProductoDatos) => boolean;` significa "función que recibe `ProductoDatos` y devuelve un booleano".
- **Aplicación en el proyecto:** `ValoresFormulario` usa `string` para precio y stock, porque los inputs siempre entregan texto. `ProductoDatos` usa `number`. La función `convertirAProductoDatos` traduce de uno a otro.

**Buena práctica que aparece hoy: separación de responsabilidades en el frontend.** La **página** tiene el estado y la lógica; los **componentes** muestran y avisan; las **utilidades** (`validarProducto.ts`) son funciones puras, fáciles de probar.

---

## 5. Distribución de los 120 minutos

| Tiempo | Actividad | Descripción |
|--------|-----------|-------------|
| 0 – 10 min | Introducción | Repaso de la sesión 1 y planteamiento del problema: "la tabla no se puede modificar". |
| 10 – 30 min | Teoría | Flujo unidireccional, callbacks, inmutabilidad, eventos, inputs controlados, validación y renderizado condicional. |
| 30 – 50 min | Demostración | El docente construye `Alerta` y el formulario controlado mínimo (solo nombre). |
| 50 – 90 min | Desarrollo guiado | Validaciones, `ProductoFormulario`, filtros, acciones de fila e `InventarioPage` con CRUD. |
| 90 – 110 min | Taller | Actividad práctica y reto. |
| 110 – 120 min | Cierre | Preguntas, evidencia y tarea. |

---

## 6. Libreto del docente

### 0 – 10 min · Introducción

> **Docente:** "La semana pasada nuestra aplicación mostraba productos. Un inventario que no se puede modificar sirve de poco. Hoy vamos a crear, editar y eliminar."

- **Pregunta de repaso:** *"¿Quién tiene la lista de productos: la tabla o la página?"* (La página, en su estado.) *"Entonces, si el botón Eliminar está en la fila, ¿cómo le avisa a la página?"* Dejar la pregunta abierta; se responde con la teoría de callbacks.

### 10 – 30 min · Teoría

- **Flujo unidireccional (5 min):** dibujar el árbol de componentes con flechas: **datos hacia abajo** (props) y **eventos hacia arriba** (callbacks). Analogía: el jefe (página) entrega información a sus empleados (componentes); cuando un empleado necesita un cambio, **se lo pide** al jefe, no modifica los archivos del jefe por su cuenta.
- **Inmutabilidad (5 min):** demostrar en la consola del navegador:
  ```js
  const a = [1, 2]; const b = a; b.push(3); a === b   // true: es el mismo arreglo
  const c = [...a, 4]; a === c                       // false: es un arreglo nuevo
  ```
  > **Pregunta:** *"Si React compara con `===`, ¿cuál de las dos formas detecta como cambio?"*
- **Eventos (3 min):** mostrar el error `onClick={eliminar(p)}` en vivo: se ejecuta al cargar la página. Luego corregirlo.
- **Inputs controlados (4 min):** el valor vive en el estado; el input solo lo **muestra** y avisa cuando cambia.
- **Validación y renderizado condicional (3 min):** recorrer la tabla de la sección 4.8.

### 30 – 50 min · Demostración

1. Crear `Alerta.tsx` (paso 1) y usarla temporalmente en la página con un mensaje fijo.
2. Construir en vivo un formulario mínimo con **un solo** input controlado, `onSubmit` y `preventDefault`, que muestre en consola lo que se escribió.
3. Mostrar con **React DevTools** (extensión del navegador) cómo cambia el estado mientras se escribe.
   > **Pregunta:** *"¿Qué pasa si quito el `onChange` y dejo el `value`?"* Probarlo: el input no deja escribir, porque React siempre muestra lo que dice el estado.

### 50 – 90 min · Desarrollo guiado

- Pasos 2 a 6.
- **Momento de interacción (paso 2):** pedir a la clase las reglas de validación antes de mostrarlas. *"¿Qué haría inválido un precio?"* Escribir las respuestas en el tablero y compararlas con el código.
- **Momento de interacción (paso 6):** antes de escribir `guardarProducto`, preguntar: *"Al editar, ¿cómo sabemos qué producto reemplazar en el arreglo?"* (Por el `id`, con `map`.)
- **Momento de interacción:** *"¿Por qué el código repetido se verifica en la página y no en el formulario?"* (El formulario no conoce la lista de productos; la página sí.)

### 90 – 110 min · Taller

Actividad práctica en parejas. Pedir a quien termine primero que ayude a otra pareja (aprendizaje entre pares).

### 110 – 120 min · Cierre

- Preguntas de comprobación.
- **Pregunta provocadora final:** *"Creen tres productos y recarguen la página. ¿Qué pasó? ¿Por qué?"* Los datos se pierden: viven en la memoria del navegador. **Ese es el problema que resolveremos en las próximas sesiones con un servidor y una base de datos.**

---

## 7. Desarrollo práctico

### Paso 1 — Componente `Alerta`

- **Archivo:** `Alerta.tsx`
- **Ruta:** `frontend/src/components/Alerta.tsx`

```tsx
export interface MensajeAlerta {
  tipo: 'exito' | 'error';
  texto: string;
  detalles?: string[];
}

interface AlertaProps {
  mensaje: MensajeAlerta;
  onCerrar: () => void;
}

/** Caja de mensaje de éxito (verde) o de error (roja), con lista opcional de detalles. */
export function Alerta({ mensaje, onCerrar }: AlertaProps) {
  return (
    <div className={`alerta alerta--${mensaje.tipo}`} role={mensaje.tipo === 'error' ? 'alert' : 'status'}>
      <div>
        <strong>{mensaje.texto}</strong>
        {mensaje.detalles && mensaje.detalles.length > 0 && (
          <ul className="alerta__detalles">
            {mensaje.detalles.map((detalle) => (
              <li key={detalle}>{detalle}</li>
            ))}
          </ul>
        )}
      </div>
      <button type="button" className="alerta__cerrar" aria-label="Cerrar mensaje" onClick={onCerrar}>
        ×
      </button>
    </div>
  );
}
```

- **Explicación:** exporta el tipo `MensajeAlerta` para que la página lo use. `detalles?` es opcional. `onCerrar` es una prop de tipo función (callback). `role="alert"` hace que los lectores de pantalla anuncien los errores (**accesibilidad**).
- **Resultado esperado:** sin errores en el editor.
- **Errores frecuentes:** `onClick={onCerrar()}` (con paréntesis) cierra la alerta apenas aparece.

### Paso 2 — Reglas de validación del formulario

- **Archivo:** `validarProducto.ts`
- **Ruta:** `frontend/src/utils/validarProducto.ts`

```ts
import { CATEGORIAS, type Categoria, type ProductoDatos } from '../types/producto';

/**
 * Valores del formulario.
 * Los inputs HTML siempre entregan texto, por eso precio y stock son string aquí.
 * Al enviar los convertimos a número (ver convertirAProductoDatos).
 */
export interface ValoresFormulario {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: Categoria | '';
  precio: string;
  stock: string;
}

/** Un posible mensaje de error por cada campo del formulario. */
export type ErroresFormulario = Partial<Record<keyof ValoresFormulario, string>>;

export const VALORES_INICIALES: ValoresFormulario = {
  codigo: '',
  nombre: '',
  descripcion: '',
  categoria: '',
  precio: '',
  stock: '',
};

/** Revisa los valores y devuelve un objeto con los errores encontrados (vacío si todo está bien). */
export function validarFormulario(valores: ValoresFormulario): ErroresFormulario {
  const errores: ErroresFormulario = {};

  const codigo = valores.codigo.trim();
  if (!codigo) {
    errores.codigo = 'El código es obligatorio';
  } else if (!/^[A-Za-z0-9-]{3,20}$/.test(codigo)) {
    errores.codigo = 'Usa de 3 a 20 letras, números o guiones';
  }

  const nombre = valores.nombre.trim();
  if (nombre.length < 3 || nombre.length > 80) {
    errores.nombre = 'El nombre debe tener entre 3 y 80 caracteres';
  }

  if (valores.descripcion.length > 300) {
    errores.descripcion = 'Máximo 300 caracteres';
  }

  if (!(CATEGORIAS as readonly string[]).includes(valores.categoria)) {
    errores.categoria = 'Selecciona una categoría';
  }

  const precio = Number(valores.precio);
  if (valores.precio.trim() === '' || Number.isNaN(precio) || precio < 0) {
    errores.precio = 'Ingresa un precio mayor o igual a 0';
  }

  const stock = Number(valores.stock);
  if (valores.stock.trim() === '' || !Number.isInteger(stock) || stock < 0) {
    errores.stock = 'Ingresa un número entero mayor o igual a 0';
  }

  return errores;
}

/** Convierte los valores del formulario (texto) en los datos que espera la API. */
export function convertirAProductoDatos(valores: ValoresFormulario): ProductoDatos {
  return {
    codigo: valores.codigo.trim().toUpperCase(),
    nombre: valores.nombre.trim(),
    descripcion: valores.descripcion.trim(),
    categoria: valores.categoria as Categoria, // ya validamos que no está vacía
    precio: Number(valores.precio),
    stock: Number(valores.stock),
  };
}
```

- **Explicación:**
  - `ValoresFormulario`: precio y stock son `string` porque así los entrega el input.
  - `ErroresFormulario = Partial<Record<keyof ValoresFormulario, string>>`: un objeto con **algunos** de los campos del formulario como llaves y un mensaje como valor. `Partial` los vuelve opcionales.
  - `validarFormulario` es una **función pura**: con los mismos valores, siempre devuelve los mismos errores. No toca el estado ni la pantalla.
  - `convertirAProductoDatos` limpia espacios, pasa el código a mayúsculas y convierte texto en número.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** `Number('')` devuelve `0`, no un error. Por eso se revisa primero `valores.precio.trim() === ''`.

### Paso 3 — Formulario de producto (crear y editar)

- **Archivo:** `ProductoFormulario.tsx`
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
  /** Devuelve true si se guardó correctamente */
  onGuardar: (datos: ProductoDatos) => boolean;
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
export function ProductoFormulario({ productoInicial, onGuardar, onCancelar }: ProductoFormularioProps) {
  const [valores, setValores] = useState<ValoresFormulario>(() => obtenerValoresIniciales(productoInicial));
  const [errores, setErrores] = useState<ErroresFormulario>({});

  const esEdicion = productoInicial !== null;

  // Un solo manejador para todos los campos: usa el atributo "name" del input.
  function manejarCambio(evento: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = evento.target;
    setValores({ ...valores, [name]: value }); // copiamos el objeto y cambiamos un campo
    setErrores({ ...errores, [name]: undefined }); // borramos el error del campo que se está corrigiendo
  }

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); // evita que el navegador recargue la página

    const erroresEncontrados = validarFormulario(valores);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) {
      return; // hay errores: no enviamos nada
    }

    const guardadoCorrectamente = onGuardar(convertirAProductoDatos(valores));
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
        <button type="submit" className="boton boton--primario">
          {esEdicion ? 'Guardar cambios' : 'Agregar producto'}
        </button>
        {esEdicion && (
          <button type="button" className="boton boton--secundario" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
```

- **Explicación:**
  - `useState(() => obtenerValoresIniciales(productoInicial))`: el estado inicial sale del producto que se va a editar o de `VALORES_INICIALES` si es nuevo.
  - `manejarCambio` usa `[name]: value`, una **propiedad computada**: si el input tiene `name="precio"`, actualiza `valores.precio`. Un solo manejador sirve para los seis campos.
  - `manejarEnvio`: `preventDefault()` → validar → si hay errores, mostrarlos y detenerse → si no, llamar a `onGuardar`. Si se guardó y era creación, limpia el formulario.
  - `noValidate` desactiva los globos de validación del navegador para usar los nuestros.
  - Cada `<label htmlFor="codigo">` está unido a su `<input id="codigo">`: al hacer clic en la etiqueta se enfoca el campo (**accesibilidad**).
- **Resultado esperado:** sin errores en el editor.
- **Errores frecuentes:**
  - Olvidar el atributo `name` en un input: el campo no se actualiza, porque `[name]` queda vacío.
  - Poner `value` sin `onChange`: el campo queda de solo lectura y React avisa en la consola.

### Paso 4 — Barra de búsqueda y filtro

- **Archivo:** `BarraFiltros.tsx`
- **Ruta:** `frontend/src/components/BarraFiltros.tsx`

```tsx
import { CATEGORIAS, type Categoria } from '../types/producto';

export type FiltroCategoria = Categoria | 'Todas';

interface BarraFiltrosProps {
  busqueda: string;
  categoria: FiltroCategoria;
  onBusquedaChange: (texto: string) => void;
  onCategoriaChange: (categoria: FiltroCategoria) => void;
}

/**
 * Campo de búsqueda y selector de categoría.
 * Es un componente "controlado": no guarda estado propio; recibe los valores
 * por props y avisa al padre cada vez que el usuario los cambia.
 */
export function BarraFiltros({ busqueda, categoria, onBusquedaChange, onCategoriaChange }: BarraFiltrosProps) {
  return (
    <div className="filtros">
      <input
        type="search"
        className="campo__control"
        placeholder="Buscar por nombre o código..."
        aria-label="Buscar producto"
        value={busqueda}
        onChange={(evento) => onBusquedaChange(evento.target.value)}
      />
      <select
        className="campo__control"
        aria-label="Filtrar por categoría"
        value={categoria}
        onChange={(evento) => onCategoriaChange(evento.target.value as FiltroCategoria)}
      >
        <option value="Todas">Todas las categorías</option>
        {CATEGORIAS.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    </div>
  );
}
```

- **Explicación:** componente **sin estado propio** (controlado por el padre). Recibe los valores y avisa los cambios con `onBusquedaChange` y `onCategoriaChange`. `FiltroCategoria` agrega la opción `'Todas'` al tipo `Categoria`.
- **Resultado esperado:** sin errores.
- **Errores frecuentes:** olvidar `as FiltroCategoria`: TypeScript avisa que `string` no es asignable al tipo.

### Paso 5 — Acciones en la fila y en la tabla

- **Archivo:** `ProductoFila.tsx` (reemplaza la versión de la sesión 1)
- **Ruta:** `frontend/src/components/ProductoFila.tsx`

```tsx
import type { Producto } from '../types/producto';
import { formatearPrecio, obtenerEstadoStock } from '../utils/formato';

interface ProductoFilaProps {
  producto: Producto;
  estaEditando: boolean;
  onEditar: (producto: Producto) => void;
  onEliminar: (producto: Producto) => void;
  onCambiarStock: (producto: Producto, cantidad: number) => void;
}

const TEXTO_ESTADO = {
  agotado: 'Agotado',
  bajo: 'Stock bajo',
  normal: 'Disponible',
};

/** Una fila de la tabla: muestra un producto y sus botones de acción. */
export function ProductoFila({ producto, estaEditando, onEditar, onEliminar, onCambiarStock }: ProductoFilaProps) {
  const estado = obtenerEstadoStock(producto.stock);

  return (
    <tr className={estaEditando ? 'fila--editando' : undefined}>
      <td className="celda--codigo">{producto.codigo}</td>
      <td>
        <div className="celda__nombre">{producto.nombre}</div>
        {/* Renderizado condicional: la descripción solo se muestra si existe */}
        {producto.descripcion && <div className="celda__descripcion">{producto.descripcion}</div>}
      </td>
      <td>{producto.categoria}</td>
      <td className="celda--numero">{formatearPrecio(producto.precio)}</td>
      <td>
        <div className="stock">
          <button
            type="button"
            className="boton-icono"
            aria-label={`Restar una unidad a ${producto.nombre}`}
            disabled={producto.stock === 0}
            onClick={() => onCambiarStock(producto, -1)}
          >
            −
          </button>
          <span className="stock__cantidad">{producto.stock}</span>
          <button
            type="button"
            className="boton-icono"
            aria-label={`Sumar una unidad a ${producto.nombre}`}
            onClick={() => onCambiarStock(producto, 1)}
          >
            +
          </button>
        </div>
      </td>
      <td>
        <span className={`etiqueta etiqueta--${estado}`}>{TEXTO_ESTADO[estado]}</span>
      </td>
      <td>
        <div className="acciones">
          <button type="button" className="boton boton--secundario boton--pequeno" onClick={() => onEditar(producto)}>
            Editar
          </button>
          <button type="button" className="boton boton--peligro boton--pequeno" onClick={() => onEliminar(producto)}>
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
```

- **Archivo:** `ProductoTabla.tsx` (reemplaza la versión de la sesión 1)
- **Ruta:** `frontend/src/components/ProductoTabla.tsx`

```tsx
import type { Producto } from '../types/producto';
import { ProductoFila } from './ProductoFila';

interface ProductoTablaProps {
  productos: Producto[];
  idEditando: string | null;
  onEditar: (producto: Producto) => void;
  onEliminar: (producto: Producto) => void;
  onCambiarStock: (producto: Producto, cantidad: number) => void;
}

/** Tabla de productos. Si la lista está vacía muestra un mensaje. */
export function ProductoTabla({ productos, idEditando, onEditar, onEliminar, onCambiarStock }: ProductoTablaProps) {
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
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* map() convierte cada producto en una fila. La prop key ayuda a React a identificar cada fila. */}
          {productos.map((producto) => (
            <ProductoFila
              key={producto.id}
              producto={producto}
              estaEditando={producto.id === idEditando}
              onEditar={onEditar}
              onEliminar={onEliminar}
              onCambiarStock={onCambiarStock}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- **Explicación:** la tabla **no usa** los callbacks: solo los **reenvía** a cada fila. La fila los ejecuta con el producto correspondiente: `onClick={() => onEliminar(producto)}`. El botón − se deshabilita cuando el stock es 0. `aria-label` describe los botones de un solo símbolo para los lectores de pantalla.
- **Resultado esperado:** TypeScript marca error en `InventarioPage`, porque ahora `ProductoTabla` exige más props. **Es la ayuda de TypeScript**: se corrige en el paso 6.
- **Errores frecuentes:** los botones sin `type="button"` dentro de un formulario lo envían; aquí no están en uno, pero es un buen hábito escribirlo siempre.

### Paso 6 — CRUD en `InventarioPage`

- **Archivo:** `InventarioPage.tsx` (reemplaza la versión de la sesión 1)
- **Ruta:** `frontend/src/pages/InventarioPage.tsx`

```tsx
import { useState } from 'react';
import { Alerta, type MensajeAlerta } from '../components/Alerta';
import { BarraFiltros, type FiltroCategoria } from '../components/BarraFiltros';
import { ProductoFormulario } from '../components/ProductoFormulario';
import { ProductoTabla } from '../components/ProductoTabla';
import { ResumenInventario } from '../components/ResumenInventario';
import { productosIniciales } from '../data/productosIniciales';
import type { Producto, ProductoDatos } from '../types/producto';

/**
 * Página principal del inventario (versión de la sesión 2).
 * Todo el CRUD ocurre en el estado de React: si recargas la página, los cambios se pierden.
 */
export function InventarioPage() {
  // ---------- Estado ----------
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [mensaje, setMensaje] = useState<MensajeAlerta | null>(null);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<FiltroCategoria>('Todas');

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

  return (
    <main className="contenedor">
      {mensaje && <Alerta mensaje={mensaje} onCerrar={() => setMensaje(null)} />}

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
    </main>
  );
}
```

- **Explicación:**
  - **Crear:** se arma un `Producto` con `crypto.randomUUID()` (id único generado por el navegador) y se agrega con `[nuevo, ...productos]`.
  - **Editar:** `{ ...productoEditando, ...datos }` combina el producto original con los datos nuevos; `map` reemplaza solo ese producto.
  - **Eliminar:** `window.confirm` pide confirmación y `filter` crea un arreglo sin ese producto.
  - **Stock:** `map` con `{ ...item, stock: nuevoStock }`.
  - **Regla de negocio:** `some` revisa que el código no esté repetido.
  - **`key={productoEditando?.id ?? 'nuevo'}`:** cuando cambia la `key`, React desecha el formulario anterior y crea uno nuevo, con los datos del producto elegido. Es la forma recomendada de "reiniciar" un componente.
  - `productosFiltrados` es un valor derivado de tres estados: `productos`, `busqueda` y `categoriaFiltro`.
- **Resultado esperado:**
  1. Enviar el formulario vacío muestra 5 mensajes de error en rojo.
  2. Crear `pap-010 · Cuaderno argollado · Papelería · 5900 · 4` → aparece primero en la tabla como **PAP-010**, con la etiqueta *Stock bajo*, y el resumen se actualiza.
  3. Intentar crear otro producto con código `ELE-001` → alerta roja *Ya existe un producto con el código ELE-001*.
  4. **Editar** resalta la fila y carga los datos en el formulario; **Cancelar** lo limpia.
  5. **+ / −** cambian el stock y la etiqueta de estado.
  6. Buscar "caf" deja solo el café; filtrar por *Papelería* deja 2 o 3 productos.
- **Errores frecuentes:**
  - Usar `productos.push(...)` → la tabla no cambia.
  - Escribir `setProductos(productos.filter(...))` sin `return` dentro de un bloque `{ }` en el filtro.
  - `crypto.randomUUID is not a function` → ocurre si se abre la app desde una IP de la red en lugar de `localhost`. Usar `http://localhost:5173`.

---

## 8. Actividad práctica (parejas, 15 min)

1. Agregar al formulario un contador de caracteres para el **nombre** (como el de la descripción: `12/80`).
2. Hacer que la alerta de **éxito** muestre también el código del producto: *Producto "Cuaderno" (PAP-010) agregado*.
3. Probar el formulario con datos límite: stock `2.5`, precio `-1`, código `AB`, nombre con solo espacios. Anotar qué mensaje aparece en cada caso.

## 9. Reto

Agregar un botón **"Limpiar filtros"** en `BarraFiltros` que ponga la búsqueda en vacío y la categoría en `'Todas'`. Debe aparecer **solo** cuando haya algún filtro activo (renderizado condicional). Pista: el componente necesitará una nueva prop `onLimpiar`.

## 10. Preguntas de comprobación (con respuesta esperada)

1. **¿Qué es un input controlado?** Un input cuyo valor viene del estado de React y se actualiza con `onChange`.
2. **¿Por qué `setProductos([...productos, nuevo])` y no `productos.push(nuevo)`?** Porque React detecta cambios por referencia; `push` modifica el mismo arreglo y React no redibuja.
3. **¿Cómo le avisa `ProductoFila` a `InventarioPage` que se pulsó Eliminar?** Llamando a la función `onEliminar`, que recibió por props desde la página (a través de la tabla).
4. **¿Qué diferencia hay entre `onClick={eliminar(p)}` y `onClick={() => eliminar(p)}`?** La primera ejecuta la función al dibujar; la segunda entrega una función para ejecutar al hacer clic.
5. **¿Por qué el formulario guarda precio y stock como texto?** Porque los inputs siempre entregan `string`; se convierten a número al enviar.
6. **¿La validación en React es suficiente para proteger los datos?** No. Mejora la experiencia, pero se puede saltar. El servidor también debe validar (sesión 5).

## 11. Evidencia de aprendizaje

- Video corto (máximo 1 minuto) o secuencia de capturas donde se vea: validación con errores → crear → editar → +/- stock → eliminar → filtrar.
- Commit: `git commit -m "Sesión 2: CRUD en estado, formularios y validaciones"`.

## 12. Tarea (autónoma, ~1,5 h)

1. Terminar el reto.
2. Leer en MDN la guía "Usando Fetch" y "Una visión general de HTTP".
3. **Preparación para la sesión 3:** repasar Promesas y `async/await` en JavaScript. Ejecutar en la consola del navegador:
   ```js
   const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
   async function demo() { console.log('inicio'); await esperar(2000); console.log('fin'); }
   demo();
   ```
   Explicar por escrito, en 3 líneas, qué hace `await`.
