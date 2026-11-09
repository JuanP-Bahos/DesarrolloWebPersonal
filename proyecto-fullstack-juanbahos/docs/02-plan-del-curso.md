# Fase 3 — Plan de las 8 sesiones

**Curso:** Desarrollo Web Full Stack con React, Express y MongoDB
**Intensidad:** 8 sesiones × 2 horas = 16 horas presenciales + trabajo autónomo (≈ 1,5 h por sesión)
**Público:** estudiantes principiantes que ya conocen lo básico de HTML, CSS y JavaScript (variables, funciones, arreglos, objetos)
**Proyecto único:** *StockFácil*. Cada sesión agrega una capa al mismo repositorio.

## Mapa del curso

```
 FRONTEND                         BACKEND                          PERSISTENCIA
 ─────────────────────────────    ─────────────────────────────    ──────────────────────
 S1 React + TS: ver productos     S4 Express: primera API          S7 MongoDB + Mongoose
 S2 Formularios y estado: CRUD    S5 CRUD REST en memoria          S8 CRUD persistente
    local                         S6 Integración React ↔ Express      de extremo a extremo
 S3 HTTP, fetch, useEffect
```

## Evolución del proyecto sesión a sesión

| Sesión | Estado del proyecto al terminar | Dónde viven los datos |
|--------|----------------------------------|-----------------------|
| 1 | La interfaz muestra la tabla de productos y el resumen | Arreglo fijo en `frontend/src/data` |
| 2 | Se puede crear, editar, eliminar, buscar, filtrar y ajustar el stock | Estado de React (se pierde al recargar) |
| 3 | El frontend obtiene los datos con `fetch`, muestra carga y error, y tiene listo el servicio HTTP | Archivo JSON estático en `public/` |
| 4 | El backend responde `GET /api/salud` y `GET /api/productos` | Arreglo en memoria del servidor |
| 5 | La API tiene CRUD completo, con validación y errores, y está probada con Thunder Client o Postman | Arreglo en memoria del servidor |
| 6 | React y Express funcionan integrados | Memoria del servidor (se pierde al reiniciarlo) |
| 7 | Express está conectado a MongoDB: listar y crear usan la base; hay datos de ejemplo con `npm run seed` | MongoDB (parcial) |
| 8 | CRUD completo persistente, con validaciones y manejo de errores | **MongoDB** |

## Detalle por sesión

### Sesión 1 — Introducción a React + TypeScript
- **Objetivo:** crear el proyecto con Vite y construir la primera versión visual de StockFácil usando componentes, props y un estado inicial.
- **Conceptos:** SPA, React, TypeScript, JS vs TS, Vite, componentes, JSX/TSX, props, estado, estructura del proyecto.
- **Producto:** `Encabezado`, `ResumenInventario`, `ProductoTabla`, `ProductoFila`, `InventarioPage` y tipo `Producto`.
- **Evidencia:** captura de la tabla con 6 productos y el resumen calculado.

### Sesión 2 — Componentes, estado y formularios
- **Objetivo:** convertir la vista estática en una aplicación interactiva con CRUD en el estado de React.
- **Conceptos:** componentes reutilizables, props de función (callbacks), `useState`, eventos, formularios, inputs controlados, validaciones, listados con `key`, renderizado condicional, interfaces.
- **Producto:** `ProductoFormulario`, `BarraFiltros`, `Alerta`, botones de editar, eliminar y +/- stock.
- **Evidencia:** video corto o capturas de crear, editar, eliminar y filtrar.

### Sesión 3 — Consumo de API
- **Objetivo:** entender HTTP/REST y preparar el frontend para comunicarse con un servidor.
- **Conceptos:** HTTP, REST, métodos, JSON, `fetch`, `async/await`, `useEffect`, estados de carga y error, variables de entorno (`VITE_API_URL`).
- **Producto:** `services/api.ts`, `services/productoService.ts`, `Cargando`, `.env`, y la carga inicial desde `public/productos-demo.json`.
- **Evidencia:** captura de la pestaña *Network* con la petición GET y del estado de error.

### Sesión 4 — Node.js + Express
- **Objetivo:** crear la primera API REST con Express y TypeScript.
- **Conceptos:** Node.js, Express, servidor HTTP, request y response, métodos, rutas, middleware, JSON, CORS, variables de entorno, códigos de estado.
- **Producto:** `backend/` con `app.ts`, `server.ts`, `config/env.ts`, middleware de registro, `GET /api/salud` y `GET /api/productos`.
- **Evidencia:** respuesta de ambos endpoints en el navegador y en Thunder Client.

### Sesión 5 — CRUD REST
- **Objetivo:** completar el CRUD con arquitectura por capas, validaciones y manejo de errores.
- **Conceptos:** rutas, controladores, servicios, validación, `HttpError`, middleware de errores, status codes, pruebas con clientes HTTP.
- **Producto:** `routes/`, `controllers/`, `services/` (en memoria), `middlewares/validarProducto.ts`, `pruebas/api.http`.
- **Evidencia:** colección de pruebas con los 7 endpoints y sus casos de error.

### Sesión 6 — Integración Frontend + Backend
- **Objetivo:** conectar React con Express y seguir una petición de extremo a extremo.
- **Conceptos:** modelo cliente-servidor, CORS en la práctica, DevTools (*Network*), actualización del estado a partir de la respuesta del servidor, PATCH para el stock.
- **Producto:** `InventarioPage` usando `productoService` en todas las operaciones.
- **Evidencia:** diagrama del flujo de una operación, hecho por el estudiante, con captura de *Network*.

### Sesión 7 — MongoDB
- **Objetivo:** comprender el modelo documental y conectar Express con MongoDB mediante Mongoose.
- **Conceptos:** NoSQL, MongoDB, base de datos, colección, documento, BSON, ObjectId, Compass, conexión desde Node.js, `MONGODB_URI`, Mongoose (esquema y modelo).
- **Producto:** `config/database.ts`, `models/producto.model.ts`, `scripts/seed.ts`; `listarProductos` y `crearProducto` leen y escriben en MongoDB.
- **Evidencia:** captura de Compass con la colección `productos` y los documentos creados desde la app.

### Sesión 8 — CRUD con persistencia
- **Objetivo:** completar el CRUD persistente con validaciones y manejo de errores de la base de datos, y dejar la aplicación funcionando de extremo a extremo.
- **Conceptos:** `findById`, `findByIdAndUpdate`, `findByIdAndDelete`, `runValidators`, validación de ObjectId, errores `ValidationError`, `CastError` y `11000`.
- **Producto:** `services/producto.service.ts` 100 % sobre MongoDB, `middlewares/validarId.ts` y `manejarErrores` completo.
- **Evidencia:** demostración en vivo de que los datos sobreviven al reinicio del servidor, más la entrega final evaluada con la rúbrica.

## Conexión entre sesiones

Cada sesión termina con una **tarea** que prepara la siguiente, y empieza con un **repaso de 10 minutos** de la anterior. El docente debe:

1. Publicar al final de cada sesión el estado del código de referencia de esa sesión (el libreto contiene todo el código).
2. Pedir que cada estudiante haga un commit al terminar cada sesión, por ejemplo `git commit -m "Sesión 3: servicio HTTP y useEffect"`. Así el historial de Git cuenta la evolución del proyecto.

## Evaluación sugerida

| Componente | Peso |
|------------|------|
| Evidencias de las sesiones 1 a 7 (≈ 5 % cada una) | 35 % |
| Talleres y retos en clase | 15 % |
| Proyecto final (rúbrica en `docs/RUBRICA.md`) | 40 % |
| Sustentación oral del flujo de datos | 10 % |

## Libretos

- [Sesión 1 — Introducción a React + TypeScript](sesiones/sesion-01-react-typescript.md)
- [Sesión 2 — Componentes, estado y formularios](sesiones/sesion-02-estado-formularios.md)
- [Sesión 3 — Consumo de API](sesiones/sesion-03-consumo-api.md)
- [Sesión 4 — Node.js + Express](sesiones/sesion-04-node-express.md)
- [Sesión 5 — CRUD REST](sesiones/sesion-05-crud-rest.md)
- [Sesión 6 — Integración Frontend + Backend](sesiones/sesion-06-integracion.md)
- [Sesión 7 — MongoDB](sesiones/sesion-07-mongodb.md)
- [Sesión 8 — CRUD con persistencia](sesiones/sesion-08-crud-persistencia.md)
