# Rúbrica de evaluación — Proyecto StockFácil

**Escala:** 1 (Insuficiente) · 2 (En desarrollo) · 3 (Aceptable) · 4 (Bueno) · 5 (Excelente)
**Uso:** evaluar el proyecto final (sesión 8). También sirve para la autoevaluación y la coevaluación.

## Criterios y niveles

| Criterio | 1 · Insuficiente | 2 · En desarrollo | 3 · Aceptable | 4 · Bueno | 5 · Excelente |
|----------|------------------|-------------------|---------------|-----------|---------------|
| **1. React** | La interfaz no carga o está en un solo componente sin estructura. | Hay componentes, pero no se usan bien las props o el estado (datos duplicados, mutación directa). | Componentes con props y `useState`; listas con `key`; formulario funcional. | Componentes reutilizables, inputs controlados, renderizado condicional y callbacks bien nombrados (`on...`). Estado inmutable. | Además: valores derivados en lugar de estado duplicado, `useEffect` con limpieza, reinicio del formulario con `key`. Sabe justificar cada decisión. |
| **2. TypeScript** | No usa tipos o hay muchos `any` y errores de compilación. | Tipos básicos; `npm run build` falla o hay `any` innecesarios. | Interfaces para `Producto` y para las props; compila sin errores. | Tipos precisos (`Categoria` como unión, `Omit`, `Partial`, genéricos en `solicitar<T>`); sin `any`. | Además: tipado de eventos, *type guards* (`error is ...`), `vite-env.d.ts`. Usa los tipos para prevenir errores y lo explica. |
| **3. Frontend** (UX y servicios) | No hay retroalimentación al usuario; los errores rompen la app. | Se muestran algunos mensajes; faltan estados de carga o de error. | Estados de carga y error, alertas de éxito y error, confirmación al eliminar. | Validación por campo con mensajes claros, botón deshabilitado al guardar, `fetch` centralizado en servicios, variable `VITE_API_URL`. | Además: diseño adaptable a celular, accesibilidad (`label`, `aria-label`, `role`), botón de reintento y errores del servidor mostrados con detalle. |
| **4. API REST** | Endpoints sin convención REST o incompletos. | CRUD parcial; métodos o códigos de estado incorrectos (todo responde 200). | 7 endpoints funcionando con métodos correctos (GET, POST, PUT, PATCH, DELETE). | Códigos de estado adecuados (200, 201, 204, 400, 404, 409) y formato de error uniforme `{ mensaje, errores }`. | Además: diferencia clara entre PUT y PATCH, lista blanca de campos, pruebas documentadas (`api.http` o colección) que pasan al 100 %. |
| **5. Express** | El servidor no arranca o todo está en un solo archivo sin middlewares. | Rutas en `app.ts` sin separar; sin manejo de errores. | Uso de `Router`, `express.json`, `cors` y variables de entorno. | Middlewares propios (registro, validación, id) y manejador de errores centralizado; `app.ts` separado de `server.ts`. | Además: orden correcto de la cadena de middlewares, errores sin exponer detalles internos, cierre ordenado. Explica el recorrido de una petición. |
| **6. MongoDB** | No hay conexión o los datos no se guardan. | Se conecta, pero el CRUD persistente está incompleto. | CRUD completo con Mongoose; datos visibles en Compass. | Esquema con validaciones, índice único, `timestamps`, `runValidators` y `returnDocument: 'after'`; URI en `.env`. | Además: traducción de `ValidationError`, `CastError` y 11000; script de seed; `toJSON` coherente con el frontend. Explica documento, colección, BSON y ObjectId. |
| **7. Integración** | Frontend y backend no se comunican. | Se comunican solo en algunas operaciones o con errores de CORS sin resolver. | Todas las operaciones del CRUD funcionan desde la interfaz. | El estado se actualiza con la respuesta del servidor; los errores 4xx se muestran al usuario. | Además: diagnostica fallas con *Network*, la consola y el log del servidor; demuestra persistencia tras reiniciar. |
| **8. Arquitectura** | No hay separación de responsabilidades. | Carpetas creadas, pero las responsabilidades se mezclan (fetch en componentes, lógica de BD en controladores). | Estructura por capas respetada en su mayor parte. | Capas claras en ambos proyectos: páginas/componentes/servicios/tipos; rutas/controladores/servicios/modelos. | Además: puede cambiar la fuente de datos tocando solo los servicios y lo demuestra o lo explica con el código. |
| **9. Código** | Código desordenado, nombres poco claros, código muerto y secretos en el repositorio. | Nombres inconsistentes; `console.log` de depuración; archivos temporales. | Nombres descriptivos y formato consistente; `.gitignore` correcto; sin `.env` en Git. | Funciones cortas, sin duplicación, sin código muerto, constantes con nombre, comentarios útiles. `npm run lint` sin advertencias. | Además: commits frecuentes con mensajes descriptivos que cuentan la evolución por sesión; README actualizado. |
| **10. Funcionamiento** | La aplicación no se puede ejecutar siguiendo la guía. | Se ejecuta con ayuda o con pasos no documentados; fallos frecuentes. | Se ejecuta siguiendo la guía; el CRUD funciona en el caso normal. | Funciona también en los casos de error (datos inválidos, código duplicado, id inexistente); builds sin errores. | Funciona de extremo a extremo sin fallos; la colección de pruebas pasa 15/15; se ejecuta en un equipo limpio solo con `README` y `GUIA_EJECUCION`. |

## Hoja de calificación

| Criterio | Peso | Nivel (1–5) | Puntaje ponderado |
|----------|:----:|:-----------:|:-----------------:|
| 1. React | 10 % | | |
| 2. TypeScript | 10 % | | |
| 3. Frontend | 10 % | | |
| 4. API REST | 10 % | | |
| 5. Express | 10 % | | |
| 6. MongoDB | 10 % | | |
| 7. Integración | 10 % | | |
| 8. Arquitectura | 10 % | | |
| 9. Código | 10 % | | |
| 10. Funcionamiento | 10 % | | |
| **Total** | **100 %** | | **/ 5,0** |

**Cálculo:** Total = Σ (nivel × peso). Ejemplo: niveles 4, 4, 3, 5, 4, 4, 5, 4, 3, 5 → promedio ponderado **4,1**.

**Conversión sugerida:** 4,5 – 5,0 Excelente · 3,5 – 4,4 Bueno · 3,0 – 3,4 Aceptable · < 3,0 No aprobado (requiere plan de mejora).

> Los pesos son iguales por defecto. Si el curso enfatiza el backend, se puede subir API REST, Express y MongoDB al 12 % y bajar React, TypeScript y Frontend al 8 %.

## Lista de verificación rápida (antes de entregar)

- [ ] `backend`: `npm run typecheck` y `npm run build` sin errores.
- [ ] `frontend`: `npm run lint` y `npm run build` sin errores ni advertencias.
- [ ] La colección `pruebas/stockfacil.postman_collection.json` pasa 15/15 (después de `npm run seed`).
- [ ] Crear, editar, +/-, eliminar, buscar y filtrar funcionan desde la interfaz.
- [ ] Los datos persisten al reiniciar los servidores.
- [ ] El repositorio **no** contiene `node_modules/`, `dist/` ni `.env`.
- [ ] `README.md` actualizado, con la sección "Qué aprendí".

## Rúbrica de la sustentación oral (10 % del curso)

| Nivel | Descripción |
|:-----:|-------------|
| 5 | Explica con precisión el recorrido completo de una operación señalando archivos y funciones; responde las preguntas de profundización (por qué, qué pasaría si...). |
| 4 | Explica el recorrido con pequeñas imprecisiones; responde la mayoría de las preguntas. |
| 3 | Explica las capas en general, pero le cuesta ubicarlas en el código. |
| 2 | Describe partes aisladas sin conectar el flujo. |
| 1 | No logra explicar su propio proyecto. |
