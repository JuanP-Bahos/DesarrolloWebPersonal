# StockFácil — Proyecto Full Stack con React, Express y MongoDB

Aplicación web de **gestión de inventario para pequeños negocios**, construida paso a paso durante un curso de 8 sesiones. Permite registrar, consultar, editar y eliminar productos, ajustar el stock, buscar y filtrar, y ver alertas de stock bajo y el valor total del inventario.

```
INTERFAZ → REACT + TYPESCRIPT → API REST → EXPRESS → CONTROLLERS → SERVICES → MODELOS → MONGODB
```

> **¿Primera vez?** Sigue la guía paso a paso: [GUIA_EJECUCION.md](GUIA_EJECUCION.md).
> **¿Eres docente?** Empieza por [DOCENTE.md](DOCENTE.md).

---

## Tabla de contenido

1. [Descripción](#1-descripción)
2. [Tecnologías](#2-tecnologías)
3. [Arquitectura](#3-arquitectura)
4. [Requisitos](#4-requisitos)
5. [Instalación](#5-instalación)
6. [Configuración y variables de entorno](#6-configuración-y-variables-de-entorno)
7. [Ejecución](#7-ejecución)
8. [Endpoints de la API](#8-endpoints-de-la-api)
9. [Estructura del proyecto](#9-estructura-del-proyecto)
10. [Pruebas](#10-pruebas)
11. [Errores frecuentes](#11-errores-frecuentes)
12. [Documentación del curso](#12-documentación-del-curso)

---

## 1. Descripción

| | |
|---|---|
| **Problema** | Las tiendas pequeñas llevan el inventario en cuadernos u hojas de cálculo. Pierden datos, no saben qué se está agotando y no conocen el valor de su mercancía. |
| **Solución** | Una SPA en React que consume una API REST en Express, con los datos guardados en MongoDB. |
| **Funcionalidades** | CRUD de productos · validación en 3 capas · búsqueda y filtro por categoría · ajuste de stock con +/- · alertas de stock bajo (≤ 5) y agotado · resumen con total de productos, unidades y valor del inventario · estados de carga y error · diseño adaptable a celulares. |

## 2. Tecnologías

| Capa | Tecnología | Versión | Para qué |
|------|-----------|---------|----------|
| Frontend | React | 19 | Interfaz basada en componentes |
| | TypeScript | 6 | Tipado estático |
| | Vite | 8 | Servidor de desarrollo y compilación |
| | oxlint | 1 | Revisión de estilo y errores comunes |
| Backend | Node.js | ≥ 20.19 (recomendado 22 LTS o 24 LTS) | Entorno de ejecución |
| | Express | 5 | Servidor HTTP y rutas |
| | TypeScript + tsx | 6 / 4 | Tipado y ejecución en desarrollo |
| | cors · dotenv | 2 / 18 | CORS y variables de entorno |
| Persistencia | MongoDB | 7 u 8 (local) o Atlas | Base de datos de documentos |
| | Mongoose | 9 | Esquemas, validaciones y modelos |
| Comunicación | HTTP + JSON | — | API REST |

**Sin** librerías adicionales de estado, router, validación ni CSS: el objetivo es aprender los fundamentos.

## 3. Arquitectura

```
┌──────────────────────── NAVEGADOR · http://localhost:5173 ────────────────────────┐
│  main.tsx → App → InventarioPage (estado)                                         │
│                     ├─ ResumenInventario   ├─ ProductoFormulario                  │
│                     ├─ BarraFiltros        └─ ProductoTabla → ProductoFila        │
│  services/productoService.ts → services/api.ts (fetch)                            │
└───────────────────────────────────────┬───────────────────────────────────────────┘
                                        │ HTTP/JSON  GET · POST · PUT · PATCH · DELETE
┌───────────────────────────────────────▼──── SERVIDOR · http://localhost:3000/api ─┐
│  server.ts → app.ts                                                                │
│  registrarPeticiones → cors → express.json → routes/producto.routes.ts             │
│     → middlewares (validarId, validarProducto) → controllers → services → models   │
│  manejarErrores (errores → JSON { mensaje, errores })                              │
└───────────────────────────────────────┬────────────────────────────────────────────┘
                                        │ Mongoose (driver de MongoDB)
┌───────────────────────────────────────▼──── mongodb://127.0.0.1:27017 ─────────────┐
│  base inventario_db → colección productos → documentos                              │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

Detalle de capas, requisitos y flujo de información: [docs/01-propuesta-y-arquitectura.md](docs/01-propuesta-y-arquitectura.md).

## 4. Requisitos

- **Node.js 20.19 o superior** (recomendado 22 LTS o 24 LTS) → `node -v`
- **npm 10 o superior** (incluido con Node) → `npm -v`
- **MongoDB**, una de estas opciones:
  - MongoDB Community Server 7 u 8 instalado localmente, más MongoDB Compass (recomendado).
  - Una cuenta gratuita de MongoDB Atlas (clúster M0).
- Un editor (recomendado **Visual Studio Code**) y un navegador moderno.
- *(Opcional)* Git, y la extensión REST Client o Thunder Client, o Postman.

## 5. Instalación

```bash
# 1. Descomprime el ZIP (o clona el repositorio) y entra en la carpeta
cd proyecto-fullstack

# 2. Dependencias del backend
cd backend
npm install

# 3. Dependencias del frontend
cd ../frontend
npm install
```

## 6. Configuración y variables de entorno

Cada proyecto lee **su propio** archivo `.env`. Crea las copias a partir de las plantillas:

```bash
# macOS / Linux / Git Bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Windows PowerShell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

### `backend/.env`

| Variable | Obligatoria | Valor por defecto | Descripción |
|----------|:-----------:|-------------------|-------------|
| `PORT` | No | `3000` | Puerto de la API |
| `MONGODB_URI` | **Sí** | — | Cadena de conexión. Local: `mongodb://127.0.0.1:27017/inventario_db`. Atlas: `mongodb+srv://USUARIO:CONTRASENA@CLUSTER.mongodb.net/inventario_db?retryWrites=true&w=majority` |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Origen(es) del frontend autorizados, separados por coma |

### `frontend/.env`

| Variable | Obligatoria | Valor por defecto | Descripción |
|----------|:-----------:|-------------------|-------------|
| `VITE_API_URL` | No | `http://localhost:3000/api` | URL base de la API |

> **Seguridad:** los archivos `.env` están en `.gitignore` y **nunca** deben subirse al repositorio. Las variables `VITE_*` terminan en el navegador, así que son públicas: no pongas secretos en ellas.

## 7. Ejecución

Necesitas **MongoDB encendido** y **dos terminales**.

```bash
# (Una sola vez, opcional) cargar 6 productos de ejemplo — BORRA los productos existentes
cd backend
npm run seed

# Terminal 1 — API
cd backend
npm run dev          # http://localhost:3000/api

# Terminal 2 — Interfaz
cd frontend
npm run dev          # http://localhost:5173
```

Abre **http://localhost:5173**.

### Scripts disponibles

| Proyecto | Script | Qué hace |
|----------|--------|----------|
| backend | `npm run dev` | Inicia la API con recarga automática (tsx watch) |
| backend | `npm run seed` | Borra los productos y carga 6 de ejemplo |
| backend | `npm run build` | Compila TypeScript a `dist/` |
| backend | `npm start` | Ejecuta la versión compilada (`dist/server.js`) |
| backend | `npm run typecheck` | Revisa los tipos sin compilar |
| frontend | `npm run dev` | Servidor de desarrollo de Vite |
| frontend | `npm run build` | Revisa los tipos y genera la versión de producción en `dist/` |
| frontend | `npm run preview` | Sirve la versión de producción |
| frontend | `npm run lint` | Revisa el código con oxlint |
| frontend | `npm run typecheck` | Revisa los tipos |

## 8. Endpoints de la API

URL base: `http://localhost:3000/api`

| Método | Ruta | Descripción | Cuerpo | Éxito | Errores |
|--------|------|-------------|--------|-------|---------|
| GET | `/salud` | Estado de la API y de la base de datos | — | 200 | — |
| GET | `/productos` | Lista todos los productos (más recientes primero) | — | 200 | 500 |
| GET | `/productos/:id` | Obtiene un producto | — | 200 | 400, 404 |
| POST | `/productos` | Crea un producto | Producto completo | 201 | 400, 409 |
| PUT | `/productos/:id` | Reemplaza un producto | Producto completo | 200 | 400, 404, 409 |
| PATCH | `/productos/:id` | Actualiza solo los campos enviados | Campos parciales | 200 | 400, 404, 409 |
| DELETE | `/productos/:id` | Elimina un producto | — | 204 | 400, 404 |

### Producto (cuerpo de POST/PUT)

```json
{
  "codigo": "PAP-010",
  "nombre": "Cuaderno argollado 80 hojas",
  "descripcion": "Opcional, máximo 300 caracteres",
  "categoria": "Papelería",
  "precio": 5900,
  "stock": 12
}
```

| Campo | Reglas |
|-------|--------|
| `codigo` | Obligatorio, único, 3–20 caracteres (letras, números, guiones). Se guarda en MAYÚSCULAS |
| `nombre` | Obligatorio, 3–80 caracteres |
| `descripcion` | Opcional, ≤ 300 caracteres |
| `categoria` | `Electrónica`, `Papelería`, `Alimentos`, `Aseo`, `Hogar` u `Otros` |
| `precio` | Número ≥ 0 |
| `stock` | Entero ≥ 0 |

### Respuesta de un producto

```json
{
  "codigo": "PAP-010",
  "nombre": "Cuaderno argollado 80 hojas",
  "descripcion": "",
  "categoria": "Papelería",
  "precio": 5900,
  "stock": 12,
  "createdAt": "2026-09-30T21:12:20.621Z",
  "updatedAt": "2026-09-30T21:12:20.621Z",
  "id": "66f1a2b3c4d5e6f7a8b9c0d1"
}
```

### Formato de error

```json
{
  "mensaje": "Los datos del producto no son válidos",
  "errores": ["El precio es obligatorio y debe ser un número mayor o igual a 0"]
}
```

| Código | Cuándo |
|--------|--------|
| 400 | Datos inválidos, JSON mal formado, id con formato inválido o PATCH sin campos |
| 404 | El producto o la ruta no existen |
| 409 | Ya existe un producto con ese código |
| 500 | Error inesperado (el detalle solo aparece en la consola del servidor) |

## 9. Estructura del proyecto

```
proyecto-fullstack/
├── backend/
│   ├── pruebas/
│   │   ├── api.http                           # Pruebas para REST Client (VS Code)
│   │   └── stockfacil.postman_collection.json # Postman / Insomnia / Thunder Client
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts                 # Lee y valida las variables de entorno
│   │   │   └── database.ts            # Conexión a MongoDB
│   │   ├── controllers/producto.controller.ts
│   │   ├── middlewares/
│   │   │   ├── registrarPeticiones.ts # Registro de cada petición
│   │   │   ├── validarProducto.ts     # Validación del cuerpo (POST/PUT/PATCH)
│   │   │   ├── validarId.ts           # Validación del ObjectId
│   │   │   └── manejarErrores.ts      # 404 de rutas y errores → JSON
│   │   ├── models/producto.model.ts   # Esquema y modelo de Mongoose
│   │   ├── routes/producto.routes.ts
│   │   ├── services/producto.service.ts
│   │   ├── scripts/seed.ts            # Datos de ejemplo
│   │   ├── types/producto.types.ts
│   │   ├── utils/HttpError.ts
│   │   ├── app.ts                     # Configuración de Express
│   │   └── server.ts                  # Punto de entrada
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/favicon.svg
│   ├── src/
│   │   ├── components/                # Alerta, BarraFiltros, Cargando, Encabezado,
│   │   │                              # ProductoFila, ProductoFormulario, ProductoTabla,
│   │   │                              # ResumenInventario
│   │   ├── pages/InventarioPage.tsx   # Estado y lógica de la pantalla
│   │   ├── services/
│   │   │   ├── api.ts                 # Cliente HTTP (fetch + errores)
│   │   │   └── productoService.ts     # Una función por endpoint
│   │   ├── types/producto.ts
│   │   ├── utils/                     # formato.ts, validarProducto.ts
│   │   ├── App.tsx · main.tsx · index.css · vite-env.d.ts
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   ├── 01-propuesta-y-arquitectura.md # Fases 1 y 2
│   ├── 02-plan-del-curso.md           # Fase 3
│   ├── sesiones/                      # 8 libretos docentes
│   └── RUBRICA.md
├── .vscode/extensions.json            # Extensiones recomendadas
├── .env.example                       # Referencia de todas las variables
├── .gitignore
├── README.md
├── GUIA_EJECUCION.md
└── DOCENTE.md
```

## 10. Pruebas

### Pruebas de la API

1. `cd backend && npm run seed` (datos conocidos).
2. Con la API encendida, elige una opción:
   - **REST Client (VS Code):** abre `backend/pruebas/api.http` y pulsa *Send Request* sobre cada petición.
   - **Postman / Insomnia / Thunder Client:** importa `backend/pruebas/stockfacil.postman_collection.json` y ejecuta la colección completa (*Run collection*). Resultado esperado: **13 peticiones y 15 aserciones, 0 fallidas**.
   - **curl:**
     ```bash
     curl http://localhost:3000/api/salud
     curl -X POST http://localhost:3000/api/productos \
       -H "Content-Type: application/json" \
       -d '{"codigo":"HOG-001","nombre":"Bombillo LED","categoria":"Hogar","precio":6500,"stock":25}'
     ```

### Prueba manual de extremo a extremo

| Acción | Resultado esperado |
|--------|--------------------|
| Abrir la app | 6 productos; resumen: 78 unidades, $ 1.927.000 y 3 con stock bajo |
| Enviar el formulario vacío | 5 mensajes de error bajo los campos |
| Crear `hog-050` con stock 4 | Aparece primero como **HOG-050** con la etiqueta *Stock bajo* |
| Crear otra vez `HOG-050` | Alerta roja: *Ya existe un producto con el código HOG-050* |
| Editar → Guardar cambios | La fila se actualiza y el formulario vuelve a *Nuevo producto* |
| + / − | El stock cambia (PATCH) y la etiqueta se ajusta |
| Buscar "cable" / filtrar "Papelería" | Solo quedan los productos que coinciden |
| Eliminar → Aceptar | La fila desaparece (DELETE 204) |
| Reiniciar backend y frontend | Los datos siguen ahí (persistencia en MongoDB) |

### Verificaciones de calidad

```bash
cd backend  && npm run typecheck && npm run build
cd frontend && npm run lint && npm run build
```

## 11. Errores frecuentes

| Síntoma | Causa | Solución |
|---------|-------|----------|
| `Falta la variable de entorno MONGODB_URI` | No existe `backend/.env` | `cp backend/.env.example backend/.env` |
| `connect ECONNREFUSED 127.0.0.1:27017` | MongoDB no está encendido | Inicia el servicio de MongoDB (ver la guía) |
| `connect ECONNREFUSED ::1:27017` | Se usó `localhost` en la URI | Usa `127.0.0.1` |
| `bad auth : authentication failed` | Usuario o contraseña de Atlas incorrectos | Revisa *Database Access*; codifica caracteres especiales (`@` → `%40`) |
| `Server selection timed out` (Atlas) | IP no autorizada | Atlas → *Network Access* → agrega tu IP |
| `EADDRINUSE :::3000` o `Port 5173 is already in use` | El puerto ya está ocupado | Cierra la otra terminal o el proceso, o cambia el puerto |
| La app dice *"No se pudo conectar con el servidor"* | Backend apagado o `VITE_API_URL` incorrecta | Enciende el backend; revisa `frontend/.env` y reinicia Vite |
| Error de **CORS** en la consola del navegador | El origen del frontend no está en `CORS_ORIGIN` | Abre `http://localhost:5173` (no `127.0.0.1`) o agrega el origen a `CORS_ORIGIN` y reinicia el backend |
| Todas las peticiones responden 404 | Falta `/api` en `VITE_API_URL` | `VITE_API_URL=http://localhost:3000/api` |
| Cambié un `.env` y no pasa nada | Las variables se leen al arrancar | Reinicia `npm run dev` |
| `'tsx' no se reconoce...` o `vite: not found` | No se instalaron las dependencias | `npm install` en esa carpeta |
| Vite exige una versión de Node más reciente | Node desactualizado | Instala Node 22 LTS o superior |

Más casos con explicación paso a paso: [GUIA_EJECUCION.md § 10](GUIA_EJECUCION.md#10-solución-de-errores-frecuentes).

## 12. Documentación del curso

| Documento | Contenido |
|-----------|-----------|
| [docs/01-propuesta-y-arquitectura.md](docs/01-propuesta-y-arquitectura.md) | Propuesta, requisitos, alcance, arquitectura y flujo |
| [docs/02-plan-del-curso.md](docs/02-plan-del-curso.md) | Plan de las 8 sesiones y evolución del proyecto |
| [docs/sesiones/](docs/sesiones/) | Libretos docentes de 2 horas, con todo el código de cada etapa |
| [docs/RUBRICA.md](docs/RUBRICA.md) | Rúbrica de evaluación (escala 1–5) |
| [GUIA_EJECUCION.md](GUIA_EJECUCION.md) | Guía desde cero para ejecutar el proyecto |
| [DOCENTE.md](DOCENTE.md) | Guía pedagógica para el docente |

---

Proyecto educativo. Libre para usar y adaptar en contextos de enseñanza.
