# Guía de ejecución desde cero — StockFácil

Esta guía supone que **nunca** has ejecutado un proyecto de Node.js. Síguela en orden. Tiempo estimado: 30 a 45 minutos la primera vez (la mayor parte es instalar programas).

**Mapa de la guía**

1. [Requisitos](#1-requisitos)
2. [Instalación de herramientas](#2-instalación-de-herramientas)
3. [Configuración de MongoDB](#3-configuración-de-mongodb)
4. [Descarga o clonación del proyecto](#4-descarga-o-clonación-del-proyecto)
5. [Instalación de dependencias](#5-instalación-de-dependencias)
6. [Configuración de los archivos .env](#6-configuración-de-los-archivos-env)
7. [Ejecución del backend](#7-ejecución-del-backend)
8. [Ejecución del frontend](#8-ejecución-del-frontend)
9. [Pruebas](#9-pruebas)
10. [Solución de errores frecuentes](#10-solución-de-errores-frecuentes)

> **Convención:** los bloques que empiezan con `$` o que aparecen en gris son comandos para escribir en una **terminal**. En VS Code, la terminal se abre con **Ctrl + ñ** (o **Ctrl + `**) o desde el menú *Terminal → New Terminal*.

---

## 1. Requisitos

| Herramienta | Versión mínima | ¿Obligatoria? | Para qué |
|-------------|---------------|:-------------:|----------|
| Node.js (incluye npm) | 20.19 (recomendado **22 LTS** o **24 LTS**) | Sí | Ejecutar backend y frontend |
| MongoDB Community Server **o** cuenta en MongoDB Atlas | 7 u 8 | Sí (una de las dos) | Base de datos |
| MongoDB Compass | Cualquiera reciente | Recomendada | Ver los datos gráficamente |
| Visual Studio Code | Cualquiera reciente | Recomendada | Editor |
| Navegador (Chrome, Edge, Firefox) | Reciente | Sí | Usar la aplicación |
| Git | Cualquiera | Opcional | Clonar el repositorio y versionar |

Hardware: cualquier computador con 4 GB de RAM y 2 GB libres en disco.

---

## 2. Instalación de herramientas

### 2.1 Node.js

1. Entra a **https://nodejs.org** y descarga la versión **LTS**.
2. Instálala con las opciones por defecto. En Windows, deja marcada la opción que agrega Node al *PATH*.
3. **Cierra y vuelve a abrir** la terminal (o VS Code) y verifica:

```bash
node -v    # por ejemplo v22.x.x o v24.x.x
npm -v     # por ejemplo 10.x.x
```

> Si aparece `node: command not found` o `"node" no se reconoce como un comando`, la terminal se abrió antes de instalar Node. Ciérrala y ábrela de nuevo; si persiste, reinicia el computador.

### 2.2 Visual Studio Code (recomendado)

Descárgalo de **https://code.visualstudio.com**. Al abrir el proyecto, VS Code sugerirá las extensiones recomendadas (archivo `.vscode/extensions.json`): **REST Client**, **Thunder Client**, **MongoDB for VS Code** y **Oxc**. Acepta instalarlas.

### 2.3 Git (opcional)

Descárgalo de **https://git-scm.com**. Verifica con `git --version`.

---

## 3. Configuración de MongoDB

Elige **una** opción. La **A** funciona sin internet y es la recomendada para clase. La **B** no requiere instalar nada en el computador.

### Opción A — MongoDB instalado en tu computador

#### Windows

1. Entra a **https://www.mongodb.com/try/download/community**, elige tu sistema y descarga el instalador **MSI**.
2. Durante la instalación elige **Complete** y deja marcadas:
   - *Install MongoDB as a Service* (así se enciende solo con Windows).
   - *Install MongoDB Compass*.
3. Verifica que el servicio está encendido: tecla Windows → escribe **Servicios** → busca **MongoDB Server** → estado *En ejecución*. Si no lo está: clic derecho → **Iniciar**.

#### macOS (con Homebrew)

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Instala Compass desde **https://www.mongodb.com/try/download/compass**.

#### Linux (Ubuntu/Debian)

Sigue la guía oficial *"Install MongoDB Community Edition on Ubuntu"* (docs.mongodb.com), que agrega el repositorio de MongoDB. Luego:

```bash
sudo systemctl start mongod
sudo systemctl enable mongod     # para que arranque con el sistema
sudo systemctl status mongod     # debe decir "active (running)"
```

#### Verificar con Compass

1. Abre **MongoDB Compass**.
2. En *New connection* escribe `mongodb://127.0.0.1:27017` y pulsa **Connect**.
3. Debes ver las bases `admin`, `config` y `local`. **Listo.** No necesitas crear la base `inventario_db`: se crea sola con el primer dato.

**Tu cadena de conexión será:**

```
mongodb://127.0.0.1:27017/inventario_db
```

### Opción B — MongoDB Atlas (en la nube, gratis)

1. Crea una cuenta en **https://www.mongodb.com/cloud/atlas/register**.
2. Crea un clúster **Free (M0)**. Elige el proveedor y la región más cercanos.
3. **Database Access** → *Add New Database User*:
   - Método: *Password*.
   - Usuario, por ejemplo `stockfacil_app`, y una contraseña **sin** caracteres especiales como `@ : / ? #`. Si los usas, deberás codificarlos (por ejemplo `@` → `%40`).
   - Rol: *Read and write to any database*.
4. **Network Access** → *Add IP Address* → *Add Current IP Address*. (En un aula con IP cambiante se puede usar `0.0.0.0/0` **solo para la clase**, y quitarlo después.)
5. **Database** → *Connect* → *Drivers* → copia la cadena. Se ve así:
   ```
   mongodb+srv://stockfacil_app:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
6. Reemplaza `<password>` por tu contraseña y **agrega el nombre de la base** antes del `?`:
   ```
   mongodb+srv://stockfacil_app:TU_CONTRASENA@cluster0.abcde.mongodb.net/inventario_db?retryWrites=true&w=majority
   ```

> **Atención:** Esta cadena contiene tu contraseña. Va **solo** en `backend/.env`, que no se sube a Git. Nunca la pegues en el código, en capturas de pantalla ni en chats públicos.

---

## 4. Descarga o clonación del proyecto

**Opción 1 — ZIP:** descomprime `proyecto-fullstack-react-express-mongodb.zip` en una carpeta **sin espacios ni tildes** en la ruta, por ejemplo `C:\cursos\proyecto-fullstack` o `~/cursos/proyecto-fullstack`.

**Opción 2 — Git:**

```bash
git clone <URL-del-repositorio> proyecto-fullstack
```

Abre la carpeta `proyecto-fullstack` en VS Code (*File → Open Folder*). Debes ver:

```
backend/   frontend/   docs/   README.md   GUIA_EJECUCION.md   DOCENTE.md   .env.example   .gitignore
```

> El proyecto **no trae** `node_modules` ni archivos `.env`. Es intencional: `node_modules` se descarga en el paso 5 y los `.env` se crean en el paso 6.

---

## 5. Instalación de dependencias

Abre una terminal en la carpeta `proyecto-fullstack`:

```bash
cd backend
npm install
```

Espera a que termine (1 a 2 minutos). Debe terminar con algo como `added 1xx packages` y `found 0 vulnerabilities`.

```bash
cd ../frontend
npm install
```

**Resultado esperado:** ahora existen `backend/node_modules/` y `frontend/node_modules/`.

> Si ves advertencias (`npm warn ...`) no te preocupes; solo los mensajes `npm error` impiden continuar.

---

## 6. Configuración de los archivos `.env`

Desde la carpeta `proyecto-fullstack`:

**macOS / Linux / Git Bash**

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**Windows PowerShell**

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

*(También puedes hacerlo en VS Code: clic derecho sobre `.env.example` → Copiar → Pegar → renombrar la copia a `.env`.)*

### `backend/.env`

- **Opción A (local):** no cambies nada. Ya trae `MONGODB_URI=mongodb://127.0.0.1:27017/inventario_db`.
- **Opción B (Atlas):** reemplaza la línea `MONGODB_URI=...` por tu cadena del paso 3 (sin comillas y sin espacios alrededor del `=`).

```bash
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/inventario_db
CORS_ORIGIN=http://localhost:5173
```

### `frontend/.env`

No necesitas cambiar nada:

```bash
VITE_API_URL=http://localhost:3000/api
```

---

## 7. Ejecución del backend

### 7.1 Cargar datos de ejemplo (recomendado, una sola vez)

```bash
cd backend
npm run seed
```

**Resultado esperado:**

```
[MongoDB] Conectado a la base de datos "inventario_db"
[Seed] Productos eliminados: 0
[Seed] Productos creados: 6
[MongoDB] Conexión cerrada
```

> **Atención:** `npm run seed` **borra** todos los productos antes de insertar los de ejemplo. Úsalo solo para empezar de cero.

### 7.2 Encender la API

En la **terminal 1**:

```bash
cd backend
npm run dev
```

**Resultado esperado:**

```
[MongoDB] Conectado a la base de datos "inventario_db"
[API] Servidor escuchando en http://localhost:3000/api
```

**Déjala abierta.** Esta terminal muestra una línea por cada petición recibida, por ejemplo `GET /api/productos -> 200 (3 ms)`.

Comprueba en el navegador: **http://localhost:3000/api/salud** → `{"estado":"ok","baseDeDatos":"conectada",...}`

---

## 8. Ejecución del frontend

Abre una **segunda terminal** (en VS Code, botón **+** del panel de terminal) en la raíz `proyecto-fullstack`:

```bash
npm run dev
```

**Resultado esperado:**

```
  VITE v8.x.x  ready in 300 ms
  ➜  Local:   http://localhost:5173/
```

Abre **http://localhost:5173** (usa `localhost`, no `127.0.0.1`). Debes ver:

- Encabezado verde **StockFácil**.
- Cuatro tarjetas: **6** productos · **78** unidades · **$ 1.927.000** · **3** con stock bajo.
- El formulario *Nuevo producto* y la tabla con 6 productos.

Para detener cualquiera de los dos servidores: **Ctrl + C** en su terminal.

---

## 9. Pruebas

### 9.1 Prueba rápida en la interfaz (3 minutos)

1. Pulsa **Agregar producto** con el formulario vacío → aparecen 5 mensajes en rojo.
2. Crea: código `hog-050`, categoría *Hogar*, nombre `Bombillo LED 9 W`, precio `6500`, stock `4` → aparece arriba como **HOG-050** con la etiqueta *Stock bajo*.
3. Intenta crearlo de nuevo con el mismo código → alerta roja *Ya existe un producto con el código HOG-050*.
4. Pulsa **Editar**, cambia el nombre y guarda → la fila se actualiza.
5. Pulsa **+** dos veces → el stock pasa a 6 y la etiqueta a *Disponible*.
6. Escribe "cable" en el buscador y luego filtra por *Papelería*.
7. Pulsa **Eliminar** y acepta.
8. **Persistencia:** detén ambos servidores (Ctrl + C), enciéndelos de nuevo y recarga la página. Los cambios siguen ahí.
9. En **Compass**: `inventario_db` → `productos` → *Refresh*. Verás los mismos datos.

### 9.2 Pruebas de la API

**Con REST Client (VS Code):** abre `backend/pruebas/api.http` y haz clic en *Send Request* sobre cada bloque. Las pruebas 1–7 recorren el CRUD completo; las 8–14 muestran los errores (400, 404, 409).

**Con Postman, Insomnia o Thunder Client:**

1. *Import* → selecciona `backend/pruebas/stockfacil.postman_collection.json`.
2. Ejecuta `npm run seed` (para que exista `ELE-001` y funcione la prueba de código repetido).
3. *Run collection* → resultado esperado: **15 aserciones aprobadas, 0 fallidas**.

### 9.3 Verificación de calidad del código

```bash
cd backend
npm run typecheck     # sin errores de tipos
npm run build         # genera dist/

cd ../frontend
npm run lint          # sin advertencias
npm run build         # genera dist/
```

---

## 10. Solución de errores frecuentes

### Al instalar

| Mensaje | Qué significa | Solución |
|---------|---------------|----------|
| `npm: command not found` / `"npm" no se reconoce` | Node no está instalado o la terminal no lo ve | Instala Node LTS, **cierra y abre** la terminal |
| `npm error code EACCES` (macOS/Linux) | Permisos | No uses `sudo npm install` dentro del proyecto; revisa que la carpeta sea tuya |
| `npm error code ENOENT ... package.json` | Ejecutaste `npm install` en la carpeta equivocada | Entra primero a `backend/` o a `frontend/` |
| `Unsupported engine` / Vite pide otra versión de Node | Node demasiado antiguo | Instala Node 22 LTS o superior |
| La instalación se queda "pegada" | Red lenta o proxy | Espera, o ejecuta `npm install` de nuevo |

### Al iniciar el backend

| Mensaje | Solución |
|---------|----------|
| `Falta la variable de entorno MONGODB_URI` | No existe `backend/.env`. Haz el paso 6 |
| `connect ECONNREFUSED 127.0.0.1:27017` | MongoDB no está encendido. **Windows:** *Servicios* → *MongoDB Server* → Iniciar. **macOS:** `brew services start mongodb-community`. **Linux:** `sudo systemctl start mongod` |
| `connect ECONNREFUSED ::1:27017` | Tu URI usa `localhost`; cámbialo por `127.0.0.1` |
| `bad auth : authentication failed` | Usuario o contraseña de Atlas incorrectos, o caracteres especiales sin codificar |
| `Server selection timed out after 5000 ms` | (Atlas) Tu IP no está en *Network Access*, o tu red bloquea el puerto 27017. Prueba otra red |
| `querySrv ENOTFOUND _mongodb._tcp...` | Cadena `mongodb+srv` mal copiada, o el DNS de la red la bloquea. Cópiala de nuevo o usa otra red |
| `Error: listen EADDRINUSE: address already in use :::3000` | Ya hay algo en el puerto 3000 (¿otra terminal con el backend?). Ciérralo o usa `PORT=3001` en `.env` y actualiza `VITE_API_URL` |
| `'tsx' no se reconoce como un comando` | Falta `npm install` en `backend/` |

### Al iniciar el frontend

| Mensaje | Solución |
|---------|----------|
| `Port 5173 is already in use` | Otra instancia de Vite está abierta. Ciérrala (el proyecto usa `strictPort` para no cambiar de puerto en silencio y evitar errores de CORS) |
| `Failed to resolve import ...` | Un archivo importado no existe o el nombre tiene otra mayúscula/minúscula |
| Pantalla en blanco | Abre la consola del navegador (F12 → *Console*) y lee el primer error en rojo |

### Al usar la aplicación

| Síntoma | Causa | Solución |
|---------|-------|----------|
| *"No pudimos cargar los productos. No se pudo conectar con el servidor..."* | El backend está apagado o `VITE_API_URL` es incorrecta | Enciende el backend; revisa `frontend/.env`; **reinicia** `npm run dev` del frontend |
| En la consola: `blocked by CORS policy` | El navegador está en un origen que el backend no autoriza (por ejemplo `127.0.0.1:5173`) | Abre `http://localhost:5173`, o agrega el origen a `CORS_ORIGIN` separado por coma y reinicia el backend |
| Todas las peticiones dan 404 | Falta `/api` al final de `VITE_API_URL` | `VITE_API_URL=http://localhost:3000/api` |
| La tabla está vacía pero no hay error | La base no tiene productos | Crea uno o ejecuta `npm run seed` |
| Cambié un `.env` y no pasó nada | Las variables se leen al arrancar | Detén (Ctrl + C) y vuelve a ejecutar `npm run dev` |
| *"Error interno del servidor"* | Error inesperado en el backend | Lee el detalle en la terminal del backend (línea `[Error no controlado]`) |

### Método general de diagnóstico

1. **Consola del navegador** (F12 → *Console*): ¿hay errores de JavaScript o de CORS?
2. **Pestaña *Network*** (F12 → *Network* → *Fetch/XHR*): ¿salió la petición? ¿Qué método, URL y status tiene? ¿Qué dice en *Response*?
3. **Terminal del backend:** ¿llegó la petición (hay una línea `MÉTODO /ruta -> código`)? ¿Hay un `[Error no controlado]`?
4. **Compass:** ¿el dato quedó realmente guardado?

---

¿Todo funcionó? Continúa con el [README.md](README.md) para conocer los endpoints y la estructura, o con los [libretos de las sesiones](docs/sesiones/) para entender cómo se construyó cada parte.
