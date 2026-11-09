# Guía del docente — Curso Full Stack con React, Express y MongoDB

**Proyecto conductor:** StockFácil (gestión de inventario)
**Formato:** 8 sesiones × 2 horas · estudiantes principiantes · un único proyecto que evoluciona
**Material:** este repositorio contiene el **estado final** del proyecto. El código de **cada etapa intermedia** está completo dentro de los libretos (`docs/sesiones/`).

---

## Índice

1. [Cómo usar este material](#1-cómo-usar-este-material)
2. [Preparación antes del curso](#2-preparación-antes-del-curso)
3. [Objetivos de las 8 sesiones](#3-objetivos-de-las-8-sesiones)
4. [Conceptos fundamentales](#4-conceptos-fundamentales)
5. [Actividades](#5-actividades)
6. [Preguntas clave por sesión](#6-preguntas-clave-por-sesión)
7. [Errores frecuentes de los estudiantes](#7-errores-frecuentes-de-los-estudiantes)
8. [Evidencias de aprendizaje](#8-evidencias-de-aprendizaje)
9. [Recomendaciones pedagógicas](#9-recomendaciones-pedagógicas)
10. [Evaluación](#10-evaluación)

---

## 1. Cómo usar este material

| Documento | Uso |
|-----------|-----|
| `docs/01-propuesta-y-arquitectura.md` | Presentar el proyecto en la sesión 1; volver a él en las sesiones 4 y 7 |
| `docs/02-plan-del-curso.md` | Visión general y evolución del código por sesión |
| `docs/sesiones/sesion-0X-*.md` | **Libreto de cada clase:** teoría, tiempos, guion, código paso a paso, actividades, preguntas, evidencia y tarea |
| `docs/RUBRICA.md` | Evaluación del proyecto final (escala 1–5) |
| `README.md`, `GUIA_EJECUCION.md` | Para entregar a los estudiantes |
| `backend/pruebas/` | Pruebas de API listas para REST Client y Postman |

**Estructura de cada libreto:** 1. Objetivo · 2. Competencias · 3. Conceptos previos · 4. Teoría (qué es, para qué sirve, por qué se utiliza, ejemplo y aplicación en el proyecto) · 5. Distribución de los 120 minutos · 6. Libreto del docente · 7. Desarrollo práctico (archivo, ruta, código, explicación, resultado esperado y errores frecuentes) · 8. Actividad práctica · 9. Reto · 10. Preguntas de comprobación · 11. Evidencia · 12. Tarea.

**Estrategia sugerida con Git:** el docente mantiene un repositorio de referencia con **un commit (o una rama) por sesión** (`sesion-1`, `sesion-2`...), construido con el código de los libretos. Al final de cada clase se publica el estado de esa sesión, de modo que un estudiante que se atrase pueda ponerse al día (`git checkout sesion-5`).

---

## 2. Preparación antes del curso

### Una semana antes (enviar a los estudiantes)

- [ ] Instalar **Node.js 22 LTS** (o 24 LTS) y **VS Code**. Verificar con `node -v`.
- [ ] Instalar **Git** y crear una cuenta en GitHub o GitLab (opcional pero recomendado).
- [ ] Repasar JavaScript: arreglos (`map`, `filter`, `reduce`), objetos, desestructuración, *spread*, funciones flecha, `async/await`.

### Antes de la sesión 6 (tarea de la sesión 6)

- [ ] Instalar **MongoDB Community Server + Compass**, o crear una cuenta en **MongoDB Atlas**. **No dejarlo para el día de la sesión 7:** la instalación es el principal riesgo de pérdida de tiempo del curso.

### El docente

- [ ] Ejecutar el proyecto final completo siguiendo `GUIA_EJECUCION.md` en el mismo sistema operativo de la sala.
- [ ] Verificar la red de la sala: acceso a `registry.npmjs.org` (para `npm install`) y, si se usará Atlas, al puerto 27017 saliente.
- [ ] Tener un **plan B sin internet:** una copia de `node_modules` de cada etapa en una memoria USB, o MongoDB local en lugar de Atlas.
- [ ] Preparar un proyector con fuente grande (VS Code: `"editor.fontSize": 18`) y la terminal visible.

---

## 3. Objetivos de las 8 sesiones

| # | Sesión | Objetivo de aprendizaje | Producto al final |
|---|--------|-------------------------|-------------------|
| 1 | React + TypeScript | Crear un proyecto con Vite y construir una interfaz con componentes, props y estado | Tabla de productos y resumen del inventario |
| 2 | Componentes, estado y formularios | Implementar un CRUD en el estado de React con formularios controlados, validaciones y eventos | Crear, editar, eliminar, filtrar y ajustar el stock (local) |
| 3 | Consumo de API | Explicar HTTP/REST y obtener datos con `fetch`, `async/await` y `useEffect`, manejando carga y error | Carga desde JSON, estados de carga y error, servicio HTTP listo |
| 4 | Node.js + Express | Crear una API con Express y TypeScript con middlewares, CORS, variables de entorno y códigos de estado | `GET /api/salud` y `GET /api/productos` |
| 5 | CRUD REST | Implementar el CRUD completo por capas, con validación y manejo de errores, probado con herramientas HTTP | 7 endpoints en memoria + batería de pruebas |
| 6 | Integración | Conectar React con Express y rastrear una petición de extremo a extremo | Aplicación integrada (datos en la memoria del servidor) |
| 7 | MongoDB | Explicar el modelo documental y conectar Express a MongoDB con Mongoose | Modelo, conexión, seed; listar, obtener y crear persistentes |
| 8 | CRUD con persistencia | Completar el CRUD persistente con validación y errores de la BD, y demostrar la integración total | Aplicación completa React → Express → MongoDB |

**Objetivo general del curso:** que el estudiante construya, ejecute, modifique y **explique** una aplicación Full Stack, comprendiendo la relación entre interfaz, React + TypeScript, API REST, Express, controladores, modelos y MongoDB.

---

## 4. Conceptos fundamentales

### 4.1 Mapa conceptual del curso

```
                              ┌────────────── TypeScript (tipos en todas las capas) ──────────────┐
INTERFAZ ─▶ COMPONENTES ─▶ ESTADO ─▶ SERVICIO ─▶ HTTP/REST/JSON ─▶ RUTAS ─▶ MIDDLEWARES ─▶ CONTROLADORES ─▶ SERVICIOS ─▶ MODELOS ─▶ MONGODB
   S1          S1-S2        S1-S2      S3            S3                S4-S5      S4-S5          S5              S5-S8        S7         S7-S8
                                                  ▲ CORS · variables de entorno · códigos de estado · manejo de errores ▲
```

### 4.2 Glosario mínimo (lo que todo estudiante debe poder definir al final)

| Concepto | Definición breve | Sesión |
|----------|------------------|:------:|
| SPA | Aplicación de una sola página que actualiza su contenido sin recargar | 1 |
| Componente | Función que devuelve una parte de la interfaz | 1 |
| Props | Datos que un componente padre entrega a un hijo (solo lectura) | 1 |
| Estado | Datos propios de un componente que, al cambiar, provocan un nuevo render | 1–2 |
| Input controlado | Input cuyo valor vive en el estado de React | 2 |
| Inmutabilidad | Actualizar el estado creando objetos y arreglos nuevos | 2 |
| HTTP | Protocolo de petición/respuesta de la web | 3 |
| REST | Estilo de API: recursos (URLs) + métodos HTTP (verbos) | 3 |
| JSON | Formato de texto para intercambiar datos | 3 |
| `useEffect` | Hook para sincronizar el componente con algo externo (cargar datos) | 3 |
| Variable de entorno | Configuración externa al código (`.env`) | 3–4 |
| Node.js | Entorno para ejecutar JavaScript fuera del navegador | 4 |
| Express | Framework para crear servidores y APIs en Node | 4 |
| Middleware | Función intermedia de la cadena petición → respuesta | 4 |
| CORS | Protección del navegador ante peticiones entre orígenes distintos | 4, 6 |
| Código de estado | Número que resume el resultado (200, 201, 204, 400, 404, 409, 500) | 3–5 |
| Controlador | Traduce HTTP ↔ lógica de negocio | 5 |
| Servicio | Lógica de negocio y acceso a datos | 5 |
| Cliente-servidor | Arquitectura: el cliente pide y el servidor procesa y responde | 6 |
| NoSQL / documento | Base de datos sin tablas; datos como objetos JSON (BSON) | 7 |
| Colección | Grupo de documentos (equivale a una tabla) | 7 |
| ObjectId | Identificador de 24 caracteres hexadecimales de MongoDB | 7 |
| Mongoose | ODM: esquemas, validaciones y modelos sobre MongoDB | 7 |
| Persistencia | Los datos sobreviven a reinicios porque están en disco | 7–8 |

### 4.3 Buenas prácticas y dónde aparecen

| Buena práctica | Dónde se introduce | Evidencia en el código |
|----------------|--------------------|------------------------|
| Componentización | S1 | `frontend/src/components/` |
| Nombres descriptivos | S1 (y todo el curso) | `ProductoFormulario`, `validarProductoCompleto`, `manejarErrores` |
| Separación de responsabilidades | S2 (frontend), S5 (backend) | páginas / componentes / servicios / utils; rutas / controladores / servicios |
| Código limpio | S1–S8 | funciones cortas, constantes con nombre (`STOCK_MINIMO`), sin código muerto (S6) |
| Variables de entorno | S3 (Vite), S4 (Node), S7 (URI) | `.env.example`, `config/env.ts`, `vite-env.d.ts` |
| Validaciones | S2 (cliente), S5 (API), S7 (esquema) | `utils/validarProducto.ts`, `middlewares/validarProducto.ts`, `models/producto.model.ts` |
| Manejo de errores | S3 (cliente), S4–S5 y S8 (servidor) | `ApiError`/`solicitar()`, `HttpError`, `manejarErrores` |
| HTTP status codes | S3 (teoría), S4–S5 | controladores y `manejarErrores` |
| Arquitectura por capas | S5, demostrada en S8 | los controladores no cambian al pasar a MongoDB |
| CORS | S4, S6 | `cors({ origin: env.corsOrigins })` |
| `.gitignore` | S4 | raíz del proyecto |

---

## 5. Actividades

### 5.1 Resumen de actividades por sesión

| Sesión | Actividad en clase | Reto | Tarea |
|--------|-------------------|------|-------|
| 1 | Agregar productos y una prop opcional; explicar el recorrido de un dato | Componente `ContadorCategorias` | Leer "Pensar en React"; `git init` |
| 2 | Contador de caracteres, mensaje con código, pruebas con datos límite | Botón "Limpiar filtros" condicional | Repasar `async/await` |
| 3 | Taller "rompe y observa" (404, JSON inválido, red lenta, sin conexión) | Hora de última carga + botón Actualizar | Instalar una herramienta de pruebas de API |
| 4 | Ruta `/api/categorias`; experimento de CORS | Filtro `?categoria=` | Diseñar respuestas de error |
| 5 | Batería de 16 pruebas; ejecutar la colección de Postman | Endpoint `/api/productos/resumen` | Pruebas nuevas en `api.http` |
| 6 | Diagrama del recorrido con capturas; crear desde Thunder Client y ver en React | Deshabilitar +/- durante el PATCH | **Instalar MongoDB** |
| 7 | Verificación cruzada React ↔ Compass; edición desde Compass | Índice por categoría | Documentar los errores 500 pendientes |
| 8 | Prueba de extremo a extremo y de persistencia; autoevaluación con la rúbrica | Filtros en servidor, paginación, eliminación lógica o nuevo recurso | Implementar un reto; sección "Qué aprendí" |

### 5.2 Dinámicas recomendadas

- **Programación en parejas (conductor/navegante):** en talleres y retos. Cambiar de rol cada 10 minutos.
- **"Predice y comprueba":** antes de ejecutar algo, preguntar qué pasará (por ejemplo, un `useEffect` sin dependencias o un `push` en el estado). Luego ejecutar. Muy eficaz para corregir modelos mentales.
- **"Rompe y observa"** (S3) y **"Detectives del error"** (S6): provocar fallas a propósito y diagnosticarlas. Enseña a depurar, la habilidad más valiosa del curso.
- **Lectura en voz alta del código:** leer las rutas como frases ("PUT a /:id pasa por validarId, luego validarProductoCompleto, luego reemplazarProducto").
- **Tablero de arquitectura permanente:** dibujar en la sesión 1 el diagrama INTERFAZ → ... → MONGODB y, al inicio de cada sesión, señalar en qué capa se trabajará.

---

## 6. Preguntas clave por sesión

Cada libreto trae 6 preguntas de comprobación con su respuesta esperada. Estas son las **preguntas "puente"**, que conectan con la sesión siguiente y conviene hacer al cierre:

| Sesión | Pregunta puente | Respuesta que se busca |
|--------|-----------------|------------------------|
| 1 | "¿Cómo haríamos para agregar un producto desde la pantalla?" | Necesitamos un formulario y actualizar el estado (S2) |
| 2 | "Creen productos y recarguen. ¿Qué pasó?" | Se pierden: el estado vive en la memoria del navegador (S3–S6) |
| 3 | "Estamos leyendo un archivo. ¿Quién debería responder en realidad?" | Un servidor con una API (S4) |
| 4 | "La API solo lee. ¿Qué falta para un CRUD?" | POST, PUT, PATCH y DELETE, con validación (S5) |
| 5 | "La API funciona en Postman. ¿Y en React?" | Hay que integrarlas (S6) |
| 6 | "Reinicien el backend. ¿Dónde quedaron los datos?" | Se pierden: viven en memoria. Hace falta una base de datos (S7) |
| 7 | "¿Por qué `GET /productos/123` da 500?" | CastError sin manejar; debería ser 400 (S8) |
| 8 | "Si les piden agregar clientes, ¿qué archivos crean?" | Tipo, modelo, servicio, controlador y rutas (el mismo patrón) |

### Preguntas de sustentación final (elegir 2 o 3 por estudiante)

1. Recorre con el dedo en el código el camino de un clic en **+** hasta MongoDB y de vuelta.
2. ¿Qué pasaría si quitas `returnDocument: 'after'`? ¿Y `runValidators: true`?
3. ¿Por qué hay validación en React, en el middleware y en el esquema?
4. ¿Qué es CORS y por qué en Postman no aparece?
5. ¿Qué archivo cambiarías para usar otra base de datos? ¿Por qué solo ese?
6. ¿Por qué `.env` no está en el repositorio? ¿Cómo sabe otra persona qué variables necesita?
7. ¿Qué diferencia hay entre PUT y PATCH en este proyecto?
8. Explica qué hace la `key` del `ProductoFormulario` en `InventarioPage`.

---

## 7. Errores frecuentes de los estudiantes

### 7.1 Entorno

| Error | Sesión | Cómo prevenirlo o resolverlo |
|-------|:------:|------------------------------|
| Ejecutar comandos en la carpeta equivocada | Todas | Pedir `pwd` antes de `npm install` / `npm run dev`. Nombres de terminal en VS Code: "backend" y "frontend" |
| Node desactualizado | 1 | Verificar la versión la semana anterior |
| Olvidar reiniciar después de cambiar `.env` | 3, 4, 7 | Repetirlo como mantra: "¿cambiaste el .env? Reinicia" |
| Puerto ocupado (`EADDRINUSE`) | 4+ | Una sola terminal por servidor; cerrar con Ctrl + C, no cerrando la ventana |
| MongoDB no instalado o servicio detenido | 7 | Tarea previa obligatoria; plan B con Atlas |
| Subir `node_modules` o `.env` a Git | 4+ | `.gitignore` desde la sesión 4; revisar con `git status` |

### 7.2 React y TypeScript

| Error | Síntoma | Explicación para el estudiante |
|-------|---------|--------------------------------|
| `class` en lugar de `className` | Advertencia en la consola | TSX no es HTML; `class` es palabra reservada de JavaScript |
| Falta `key` en listas | Advertencia *unique "key" prop* | React necesita identificar cada elemento |
| `onClick={funcion(x)}` | La función se ejecuta al cargar | Debe ser `onClick={() => funcion(x)}` |
| `productos.push()` en el estado | La pantalla no se actualiza | Crear un arreglo nuevo (inmutabilidad) |
| `value` sin `onChange` | El input no deja escribir | Un input controlado necesita ambos |
| Olvidar `name` en un input | Ese campo no se actualiza | El manejador usa `name` para saber qué campo cambiar |
| `useEffect` sin arreglo de dependencias | Peticiones infinitas | `[]` = solo al montar |
| `useEffect(async () => ...)` | Advertencia de React | Definir la función async dentro del efecto |
| Olvidar `await` | Se trabaja con una Promesa en vez del dato | Todo lo que va a la red se espera |
| Variable sin prefijo `VITE_` | Llega `undefined` | Vite solo expone las variables `VITE_*` |

### 7.3 Express y API

| Error | Síntoma | Explicación |
|-------|---------|-------------|
| Middleware sin `next()` | La petición queda "cargando" | La cadena se detiene |
| `rutaNoEncontrada` antes de las rutas | Todo responde 404 | El orden de `app.use` es el orden de ejecución |
| Manejador de errores con 3 parámetros | Los errores no se capturan | Express lo reconoce por tener **4** parámetros |
| Petición sin `Content-Type: application/json` | 400 "El cuerpo debe ser un objeto JSON" | `express.json()` solo lee cuerpos JSON |
| `if (!stock)` para validar | Rechaza el stock 0 | Validar el tipo y el rango, no la "verdad" del valor |
| Ruta `/resumen` después de `/:id` | `resumen` se trata como id | Las rutas específicas van antes que las genéricas |
| `res.json()` con 204 | Cuerpo descartado, confusión | Con 204 se usa `res.send()` |
| "En Postman funciona y en React no" | Error de CORS | CORS solo aplica en el navegador |

### 7.4 MongoDB y Mongoose

| Error | Síntoma | Explicación |
|-------|---------|-------------|
| `localhost` en la URI | `ECONNREFUSED ::1:27017` | Usar `127.0.0.1` |
| URI de Atlas sin nombre de base | Datos en la base `test` | Agregar `/inventario_db` antes del `?` |
| Contraseña con `@` sin codificar | `bad auth` o URI inválida | Codificar (`%40`) o cambiar la contraseña |
| `type: string` en el esquema | Error de tipos | Es `String` (constructor), no `string` (tipo TS) |
| `findByIdAndUpdate` sin `returnDocument: 'after'` | La interfaz muestra el dato viejo | Por defecto devuelve el documento anterior |
| Sin `runValidators: true` | Se guardan valores inválidos al actualizar | Las validaciones solo corren en `save`/`create` por defecto |
| Esperar un 409 sin manejar el error 11000 | 500 | Hay que traducir el código 11000 en `manejarErrores` |
| Id mal formado sin validar | 500 (`CastError`) | `validarId` responde 400 antes de consultar |

---

## 8. Evidencias de aprendizaje

| Sesión | Evidencia | Criterio de aceptación |
|:------:|-----------|------------------------|
| 1 | Captura de la app con 8 productos + `npm run build` sin errores | El resumen coincide con los datos |
| 2 | Video o capturas del CRUD local | Se ven validación, crear, editar, +/-, eliminar y filtrar |
| 3 | Captura de *Network* + estado de error + tabla "rompe y observa" | Identifica status, *Response* y el mensaje de error de la interfaz |
| 4 | Capturas de Thunder Client, del log del servidor y del error de CORS | Incluye 200, 404 y 400 |
| 5 | Tabla de 16 pruebas + diagrama del recorrido de un PUT inválido | Todas las pruebas con resultado esperado = obtenido |
| 6 | Diagrama de recorrido con capturas + reporte "Detectives del error" | Síntoma → diagnóstico → corrección en cada caso |
| 7 | Compass con un documento creado desde React + prueba de persistencia | El mismo producto antes y después de reiniciar |
| 8 | Proyecto final + pruebas E2E + colección 15/15 + autoevaluación + sustentación | Rúbrica (`docs/RUBRICA.md`) |

**Evidencia transversal:** un commit por sesión con mensaje descriptivo. El historial de Git es la bitácora del estudiante.

---

## 9. Recomendaciones pedagógicas

### 9.1 Principios

1. **Un solo proyecto que crece.** Cada sesión se apoya en la anterior. El estudiante ve el sentido de cada capa porque *siente* el problema antes de la solución (los datos se pierden → servidor → base de datos).
2. **Problema antes que solución.** Cada sesión cierra con una pregunta puente (sección 6) que motiva la siguiente.
3. **Teoría breve, práctica larga.** Máximo 20–25 minutos de teoría continua. Cada concepto se aterriza en un archivo del proyecto.
4. **Código visible y escrito por ellos.** Evitar el "copiar y pegar" masivo. Excepción: la hoja de estilos (`index.css`) y los datos de ejemplo, que se entregan hechos.
5. **Errores como contenido.** Los talleres de fallas provocadas (S3 y S6) y los "500 pendientes" (S7 → S8) convierten el error en objeto de estudio.
6. **Evaluar la comprensión, no solo el resultado.** La sustentación oral pesa: un proyecto que funciona pero no se puede explicar no demuestra aprendizaje.

### 9.2 Manejo del tiempo

- Si el grupo va lento, **priorizar** el desarrollo guiado sobre el reto. Los retos pueden pasar a tarea.
- Tener el código de cada paso listo para compartir (repositorio del docente) y así desbloquear a quien se atrase sin detener a todos.
- Las sesiones 4 y 7 tienen instalaciones: empezar por ellas **en los primeros minutos**, mientras se da la introducción.

### 9.3 Atención a la diversidad

| Perfil | Estrategia |
|--------|------------|
| Estudiante que se atrasa | Emparejar con un compañero avanzado; darle el punto de control de la sesión anterior (rama de Git); priorizar los pasos esenciales |
| Estudiante avanzado | Retos de la sesión y retos del final de la sesión 8; pedirle que sea "monitor" de una fila |
| Sin computador propio o con equipo limitado | MongoDB Atlas (no requiere instalación); desarrollo en parejas |
| Dificultades con el inglés técnico | El código usa nombres en español; los mensajes de error en inglés se traducen en las tablas de errores frecuentes |

### 9.4 Decisiones de diseño del proyecto (por si los estudiantes preguntan)

| Decisión | Motivo |
|----------|--------|
| Nombres en español | Reduce la carga cognitiva del principiante y separa claramente lo que es "nuestro" de lo que es de la librería (`useState`, `find`...) |
| TypeScript también en el backend | Mismo lenguaje y mismos tipos en ambos lados; detecta errores de forma temprana |
| `fetch` en lugar de Axios | Viene incluido y muestra lo que realmente ocurre (por ejemplo, que 404 no es excepción) |
| Mongoose en lugar del driver nativo | Esquemas y validaciones explícitos: pedagógicamente más claro |
| Validación manual (sin Zod/Joi) | Primero entender qué hace una librería de validación; después usarla |
| CommonJS en el backend | Permite importar sin extensión `.js`, lo que evita un error muy frecuente en principiantes |
| Express 5 | Los errores de funciones `async` llegan solos al manejador: no hay `try/catch` repetidos |
| `key` para reiniciar el formulario | Es el patrón recomendado por React (evita sincronizar props con estado usando `useEffect`) |
| Sin React Router ni librería de estado | Una sola pantalla basta para enseñar componentes, estado y efectos |

### 9.5 Extensiones del curso (sesiones adicionales)

1. **Autenticación:** registro e inicio de sesión con JWT y bcrypt; rutas protegidas.
2. **Relaciones:** colección `movimientos` (entradas y salidas de stock) con referencia a `productos`.
3. **Pruebas automatizadas:** Vitest + Testing Library (frontend) y Vitest + Supertest (API).
4. **Despliegue:** Atlas + Render/Railway (backend) + Vercel/Netlify (frontend).
5. **Validación con Zod:** compartir esquemas entre frontend y backend.

---

## 10. Evaluación

| Componente | Peso | Instrumento |
|------------|:----:|-------------|
| Evidencias de las sesiones 1 a 7 | 35 % | Lista de la sección 8 (cumple / cumple parcialmente / no cumple) |
| Talleres y retos | 15 % | Observación en clase y entregas |
| Proyecto final | 40 % | **Rúbrica** → [docs/RUBRICA.md](docs/RUBRICA.md) |
| Sustentación oral | 10 % | 2 o 3 preguntas de la sección 6 |

La rúbrica usa una escala de **1 a 5** en diez criterios: React, TypeScript, Frontend, API REST, Express, MongoDB, Integración, Arquitectura, Código y Funcionamiento.
