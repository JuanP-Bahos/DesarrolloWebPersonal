# Fase 1 y 2 — Propuesta de la aplicación y arquitectura

## 1. Nombre de la aplicación

**StockFácil — Gestión de inventario para pequeños negocios**

## 2. Problema que resuelve

Muchas tiendas de barrio, papelerías y minimercados llevan su inventario en cuadernos o en hojas de cálculo sueltas. Esto genera problemas concretos:

- No se sabe con certeza cuántas unidades hay de cada producto.
- Los productos se agotan sin que nadie lo note a tiempo.
- Se duplican registros (el mismo producto anotado dos veces con nombres distintos).
- No es fácil saber cuánto dinero hay invertido en mercancía.
- La información se pierde si se daña el cuaderno o el archivo.

## 3. Objetivo

Construir una aplicación web Full Stack que permita **registrar, consultar, actualizar y eliminar productos** de un inventario, con datos **persistentes** en MongoDB, alertas visuales de **stock bajo** y un **resumen** del valor del inventario.

**Objetivo pedagógico:** que el estudiante construya la aplicación de principio a fin y entienda cada capa. Al terminar debe poder explicar cómo viaja un dato desde el clic del usuario hasta la base de datos y de regreso.

## 4. Funcionalidades

| # | Funcionalidad | Sesión en la que aparece |
|---|---------------|--------------------------|
| F1 | Ver el listado de productos en una tabla | 1 |
| F2 | Ver un resumen: total de productos, unidades, valor del inventario y alertas de stock bajo | 1 |
| F3 | Registrar un producto nuevo con un formulario validado | 2 |
| F4 | Editar un producto existente | 2 |
| F5 | Eliminar un producto (con confirmación) | 2 |
| F6 | Buscar por nombre o código y filtrar por categoría | 2 |
| F7 | Aumentar o disminuir el stock con botones +/- | 2 (local) → 6 (PATCH) |
| F8 | Mostrar estados de carga y de error al consultar datos | 3 |
| F9 | Exponer una API REST con CRUD completo | 4 – 5 |
| F10 | Conectar el frontend con la API | 6 |
| F11 | Guardar los datos de forma permanente en MongoDB | 7 – 8 |
| F12 | Cargar datos de ejemplo con un script (`npm run seed`) | 7 |

### Modelo de datos: `Producto`

| Campo | Tipo | Reglas |
|-------|------|--------|
| `id` | string | Lo genera el sistema (UUID en memoria, ObjectId en MongoDB) |
| `codigo` | string | Obligatorio, único, de 3 a 20 caracteres (letras, números y guiones), se guarda en mayúsculas |
| `nombre` | string | Obligatorio, de 3 a 80 caracteres |
| `descripcion` | string | Opcional, máximo 300 caracteres |
| `categoria` | string | Obligatoria. Una de: Electrónica, Papelería, Alimentos, Aseo, Hogar, Otros |
| `precio` | number | Obligatorio, mayor o igual a 0 |
| `stock` | number | Obligatorio, entero, mayor o igual a 0 |
| `createdAt` / `updatedAt` | fecha | Las genera el sistema |

**Regla de negocio:** un producto con `stock <= 5` se marca como **stock bajo**, y uno con `stock = 0` como **agotado**.

## 5. Requisitos

### 5.1 Requisitos funcionales

| Código | Requisito |
|--------|-----------|
| RF-01 | El sistema debe listar todos los productos registrados, del más reciente al más antiguo. |
| RF-02 | El sistema debe permitir consultar un producto por su identificador. |
| RF-03 | El sistema debe permitir crear un producto con código, nombre, descripción, categoría, precio y stock. |
| RF-04 | El sistema debe impedir registrar dos productos con el mismo código. |
| RF-05 | El sistema debe permitir actualizar todos los datos de un producto (PUT). |
| RF-06 | El sistema debe permitir actualizar parcialmente un producto, por ejemplo solo el stock (PATCH). |
| RF-07 | El sistema debe permitir eliminar un producto previa confirmación del usuario. |
| RF-08 | El sistema debe validar los datos tanto en el frontend como en el backend, e informar los errores con mensajes claros. |
| RF-09 | El sistema debe permitir buscar productos por nombre o código y filtrarlos por categoría. |
| RF-10 | El sistema debe mostrar un resumen con el total de productos, las unidades, el valor del inventario y la cantidad de productos con stock bajo. |
| RF-11 | El sistema debe resaltar visualmente los productos con stock bajo o agotados. |

### 5.2 Requisitos no funcionales

| Código | Requisito |
|--------|-----------|
| RNF-01 | **Arquitectura:** frontend y backend son proyectos separados que se comunican solo por HTTP/JSON. |
| RNF-02 | **Mantenibilidad:** el backend se organiza por capas (rutas → controladores → servicios → modelos). |
| RNF-03 | **Tipado:** frontend y backend usan TypeScript en modo estricto. |
| RNF-04 | **Seguridad básica:** las credenciales y configuraciones se leen de variables de entorno. El archivo `.env` nunca se sube al repositorio. |
| RNF-05 | **CORS:** el backend solo acepta peticiones del origen configurado del frontend. |
| RNF-06 | **Usabilidad:** la interfaz muestra estados de carga, mensajes de éxito y de error, y funciona en pantallas de celular. |
| RNF-07 | **Respuestas estándar:** la API usa los códigos HTTP correctos (200, 201, 204, 400, 404, 409, 500) y un formato de error uniforme `{ mensaje, errores? }`. |
| RNF-08 | **Portabilidad:** el proyecto se ejecuta con Node.js 22 LTS o superior y MongoDB local o MongoDB Atlas, sin Docker. |
| RNF-09 | **Rendimiento:** con hasta 1.000 productos, el listado debe cargar en menos de 1 segundo en una red local. |

## 6. Alcance

**Incluido:**

- CRUD completo de productos con persistencia en MongoDB.
- Validación en tres niveles: formulario (React), middleware (Express) y esquema (Mongoose).
- Búsqueda y filtros del lado del cliente.
- Manejo centralizado de errores en el backend.
- Documentación para ejecutar, probar y enseñar el proyecto.

**Fuera del alcance** (y por qué, para decírselo a los estudiantes):

| No incluido | Razón pedagógica |
|-------------|------------------|
| Autenticación y usuarios | Merece un curso aparte (JWT, hashing, sesiones). Es la extensión natural del proyecto. |
| React Router / varias páginas | Con una sola vista se entienden mejor el estado y el flujo de datos. |
| Librerías de estado (Redux, Zustand) | `useState` es suficiente y es la base para entenderlas después. |
| Librerías de validación (Zod, Joi) | Primero se aprende a validar "a mano"; después se entiende qué automatizan. |
| Frameworks CSS (Tailwind, Bootstrap) | Se entrega una hoja de estilos lista para enfocarse en React. |
| Docker, despliegue en la nube, pruebas automatizadas | Son temas avanzados. Se sugieren como retos finales. |
| Paginación en el servidor | Se propone como reto de la sesión 8. |

## 7. Arquitectura

### 7.1 Vista general

```
┌──────────────────────────────────────────────┐
│  NAVEGADOR (http://localhost:5173)           │
│  React + TypeScript + Vite                   │
│  pages → components → services (fetch)       │
└──────────────────────┬───────────────────────┘
                       │  HTTP + JSON  (API REST)
                       │  GET / POST / PUT / PATCH / DELETE
┌──────────────────────▼───────────────────────┐
│  SERVIDOR (http://localhost:3000/api)        │
│  Node.js + Express + TypeScript              │
│  routes → middlewares → controllers →        │
│  services → models                           │
└──────────────────────┬───────────────────────┘
                       │  Driver de MongoDB (Mongoose)
┌──────────────────────▼───────────────────────┐
│  BASE DE DATOS (mongodb://127.0.0.1:27017)   │
│  MongoDB → base inventario_db →              │
│  colección productos → documentos            │
└──────────────────────────────────────────────┘
```

### 7.2 Responsabilidad de cada capa

| Capa | Carpeta | Responsabilidad | No debe... |
|------|---------|-----------------|------------|
| Página | `frontend/src/pages` | Mantener el estado de la pantalla y coordinar componentes | Dibujar detalles de UI ni hacer `fetch` directamente |
| Componentes | `frontend/src/components` | Mostrar datos y emitir eventos (`onGuardar`, `onEliminar`) | Conocer la URL de la API |
| Servicios (front) | `frontend/src/services` | Hablar con la API por HTTP | Manipular el DOM ni el estado de React |
| Tipos | `frontend/src/types`, `backend/src/types` | Describir la forma de los datos | Contener lógica |
| Rutas | `backend/src/routes` | Asociar método + URL con un controlador | Contener lógica de negocio |
| Middlewares | `backend/src/middlewares` | Tareas transversales: validar, registrar peticiones, manejar errores | Acceder a la base de datos |
| Controladores | `backend/src/controllers` | Leer `req`, llamar al servicio y responder con `res` | Saber si los datos vienen de memoria o de MongoDB |
| Servicios (back) | `backend/src/services` | Lógica de negocio y acceso a datos | Conocer `req` o `res` |
| Modelos | `backend/src/models` | Definir el esquema y las reglas del documento en MongoDB | Responder peticiones HTTP |
| Configuración | `backend/src/config` | Variables de entorno y conexión a la base de datos | Contener valores secretos escritos en el código |

> **Idea clave del curso:** en la sesión 5 el servicio guarda los productos en un arreglo en memoria. En la sesión 8 el servicio pasa a usar MongoDB y **los controladores, las rutas y el frontend no cambian**. Esta es la mejor demostración práctica de por qué separamos responsabilidades.

### 7.3 Estructura final del proyecto

```
proyecto-fullstack/
├── frontend/                      # Cliente: React + TypeScript + Vite
│   ├── public/
│   ├── src/
│   │   ├── components/            # Piezas de interfaz reutilizables
│   │   ├── pages/                 # Pantallas (InventarioPage)
│   │   ├── services/              # Comunicación con la API (fetch)
│   │   ├── types/                 # Interfaces y tipos TypeScript
│   │   ├── utils/                 # Funciones de apoyo (formato, validación)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
├── backend/                       # Servidor: Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/                # env.ts y database.ts
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── scripts/               # seed.ts (datos de ejemplo)
│   │   ├── types/
│   │   ├── utils/                 # HttpError
│   │   ├── app.ts                 # Configuración de Express
│   │   └── server.ts              # Punto de entrada
│   ├── pruebas/                   # api.http y colección de Postman
│   ├── .env.example
│   └── package.json
├── docs/                          # Propuesta, plan, libretos y rúbrica
├── .env.example                   # Referencia de todas las variables
├── .gitignore
├── README.md
├── GUIA_EJECUCION.md
└── DOCENTE.md
```

**Adaptaciones frente a la estructura sugerida (y su justificación):**

- Se agregan `config/` y `app.ts` en el backend. Separar la configuración de Express (`app.ts`) del arranque del servidor (`server.ts`) es una práctica estándar que facilita probar la API y conectar primero la base de datos.
- Se agrega `utils/` en ambos proyectos para funciones pequeñas que no son componentes ni servicios.
- Hay un `.env.example` dentro de cada proyecto, porque cada uno lee su propio `.env`. El de la raíz sirve solo como referencia.
- No se usan `hooks/` personalizados, `context/` ni un router. Se evitan patrones que un principiante aún no necesita.

## 8. Flujo de información

### 8.1 Ejemplo completo: "Registrar un producto"

```
1. USUARIO        Llena el formulario y pulsa "Guardar producto"
       ↓
2. REACT          ProductoFormulario valida los campos (validarFormulario)
                  y llama a onGuardar(datos)
       ↓
3. REACT          InventarioPage llama a productoService.crearProducto(datos)
       ↓
4. HTTP           POST http://localhost:3000/api/productos
                  Content-Type: application/json
                  { "codigo": "PAP-010", "nombre": "Cuaderno", ... }
       ↓
5. EXPRESS        cors() → express.json() → registrarPeticiones
       ↓
6. ROUTER         producto.routes.ts:  POST /  →  validarProductoCompleto → crearProducto
       ↓
7. MIDDLEWARE     validarProductoCompleto revisa las reglas → si falla responde 400
       ↓
8. CONTROLLER     producto.controller.ts: lee req.body y llama al servicio
       ↓
9. SERVICE        producto.service.ts: ProductoModel.create(datos)
       ↓
10. MODEL         Mongoose aplica el esquema (validaciones, mayúsculas, timestamps)
       ↓
11. MONGODB       Inserta el documento en inventario_db.productos y genera el _id
       ↓
12. RESPUESTA     201 Created  { "id": "66f...", "codigo": "PAP-010", ... }
       ↓
13. REACT         Agrega el producto al estado → React vuelve a dibujar la tabla
                  y muestra "Producto creado correctamente"
```

Si algo falla (código repetido, por ejemplo), MongoDB lanza el error `11000`. El middleware `manejarErrores` lo convierte en `409 Conflict { "mensaje": "Ya existe un producto con el código PAP-010" }` y React lo muestra en una alerta roja.

### 8.2 Endpoints de la API

| Método | Ruta | Descripción | Éxito | Errores posibles |
|--------|------|-------------|-------|------------------|
| GET | `/api/salud` | Estado del servidor y de la base de datos | 200 | — |
| GET | `/api/productos` | Lista todos los productos | 200 | 500 |
| GET | `/api/productos/:id` | Obtiene un producto | 200 | 400, 404 |
| POST | `/api/productos` | Crea un producto | 201 | 400, 409 |
| PUT | `/api/productos/:id` | Reemplaza todos los datos de un producto | 200 | 400, 404, 409 |
| PATCH | `/api/productos/:id` | Actualiza solo los campos enviados | 200 | 400, 404, 409 |
| DELETE | `/api/productos/:id` | Elimina un producto | 204 | 400, 404 |

**Formato de error uniforme:**

```json
{
  "mensaje": "Los datos del producto no son válidos",
  "errores": ["El precio debe ser un número mayor o igual a 0"]
}
```
