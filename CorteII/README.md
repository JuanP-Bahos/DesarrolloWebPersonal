# STOP — El tablero digital

**UNIVERSIDAD DEL ROSARIO · Escuela de Ingeniería, Ciencia y Tecnología · Electiva de Desarrollo Web**

> Se sortea una letra, suena el cronómetro y en 120 minutos usted construye el tablero digital del torneo

| | |
|---|---|
| Duración | 120 minutos |
| Modalidad | Individual |
| Rondas | 13, encadenadas sobre un mismo proyecto |
| Temáticas | HTML5 · CSS3 · JavaScript · React con TypeScript (componentes y props) |
| Puntaje | 100 puntos + hasta 7 de bonificación (el total nunca supera 100) |

---

## 1. Qué hay en este kit

```
kit-torneo/
├── README.md                      ← este archivo: todas las indicaciones
├── arbitro.mjs                    ← el árbitro: revisa su proyecto y reparte sellos
├── BITACORA.md                    ← se diligencia al final y se entrega
├── recursos/ronda-ejemplo.json    ← una ronda jugada, para probar sus funciones
├── recursos/letras.txt            ← las letras habilitadas para el sorteo
├── rescate/                       ← solo si usa el comodín SALTO
└── .gitignore
```

El kit **no contiene el proyecto**. Usted lo escribe desde una carpeta vacía.

## 2. El caso

El comité de bienestar organizó el Torneo Rosarista de STOP y se le salió de las manos: ciento veinte jugadores, hojas de papel arrugadas, letras repetidas y tres discusiones serias sobre si «ñandú» vale cuando la letra es Ñ. El acta de la final del año pasado se perdió porque alguien la usó para limpiar una mesa.

Bienestar necesita un tablero digital antes de la próxima jornada: una pantalla donde se vea la letra sorteada, las seis categorías, las respuestas de cada jugador y el marcador calculado sin peleas.

Usted es el único desarrollador disponible y el torneo arranca en dos horas. Juegue sus trece rondas.

### Las seis categorías del torneo

**Nombre** · **Lugar** · **Animal** · **Objeto** · **Marca** · **Comida**

### Cómo se puntúa en STOP

| Puntos | Cuándo |
|---|---|
| 100 puntos | La respuesta es válida y nadie más la escribió |
| 50 puntos | La respuesta es válida pero otro jugador escribió la misma |
| 0 puntos | La casilla está vacía o la respuesta no empieza por la letra sorteada |

Esa misma tabla es la que usted va a programar en la Ronda 8. Y es también la forma en que se califica este parcial: cada criterio vale 100 %, 50 % o 0, como una casilla de STOP.

## 3. La letra del torneo

Al minuto cero el profesor sortea **una letra** para todo el grupo.

Todo el contenido que usted invente durante el parcial debe empezar por esa letra: el nombre del torneo, los nombres de los jugadores, las respuestas de las casillas y los datos de ejemplo de su JavaScript. No es decoración: es lo que hace que ningún tablero se parezca a otro y que copiar no sirva de nada.

> Si la letra sorteada es **C**, su torneo puede llamarse «Copa Caribe», sus jugadores Camila, Carlos y Cecilia, y sus respuestas Cali, Caballo, Cuchara, Chevrolet, Carimañola.

## 4. Preparación previa

- Node.js 20 o superior instalado (`node -v`), necesario solo para las rondas 11 a 13.
- Visual Studio Code con la extensión Live Server (o equivalente) para ver el HTML sin montar servidor.
- Un navegador moderno con las herramientas de desarrollador a la mano.
- Git configurado con su nombre y correo institucional.
- Haber ejecutado al menos una vez `npm create vite@latest` en su equipo para tener la caché de npm lista: el día del parcial la red del aula puede estar saturada.
- Opcional: tener descargado el CSS de Bootstrap por si la red falla.

## 5. Reglas

1. El parcial es individual. Cada estudiante entrega su propio repositorio.
2. Duración: 120 minutos exactos. El cronómetro es público y no se detiene.
3. **La letra del torneo se sortea al minuto cero** y es la misma para todo el grupo. Todo el contenido que usted invente —nombres, respuestas, nombre del torneo— debe empezar por esa letra.
4. Las rondas son secuenciales: lo que construye en una es el insumo de la siguiente.
5. Al final de cada ronda el profesor anuncia **¡STOP!**: todos hacen commit con el formato `ronda-NN: descripción`. El historial de git es parte de la evaluación.
6. Se permite consultar documentación oficial: MDN, react.dev, getbootstrap.com y la documentación de TypeScript.
7. No se permiten asistentes de inteligencia artificial, código propio de proyectos anteriores ni plantillas descargadas.
8. Todo se escribe durante el parcial, desde una carpeta vacía. Lo único que recibe es el kit del torneo.
9. No se evalúa backend, bases de datos ni estado en React: este parcial cubre HTML, CSS, JavaScript y componentes con props.
10. Cada estudiante tiene **dos comodines PISTA** (el profesor responde una duda puntual; cuesta el 10 % de esa ronda) y **un comodín SALTO** (usa el archivo de rescate del kit para continuar; esa ronda vale 0 pero la cadena no se rompe).
11. Si una ronda no le funciona, documente en `BITACORA.md` qué intentó y qué error obtuvo: eso otorga puntaje parcial.
12. La entrega se hace dentro del tiempo. Lo que llegue después no se evalúa.

## 6. Qué debe quedar construido

```
mi-torneo-stop/                ← su repositorio
├── index.html                 Rondas 1 y 2
├── estilos.css                Rondas 3 a 7
├── js/
│   ├── datos.js               Ronda 8
│   ├── puntaje.js             Rondas 8 y 10
│   ├── validar.js             Ronda 9
│   └── app.js                 Ronda 10
├── recursos/                  escudo, timbre
├── tablero/                   Rondas 11 a 13 (proyecto React con Vite)
│   └── src/
│       ├── tipos.ts
│       ├── puntaje.ts
│       └── componentes/
└── BITACORA.md
```

Los nombres de archivo pueden variar. Lo que no debe faltar es la separación: marcado, estilos, lógica y componentes en archivos distintos.

## 7. Las 13 rondas

Cada ronda usa lo que construyó la anterior. Léala completa antes de escribir código.

### Bloque HTML

#### Ronda 1 — El tablero de papel

*Antes de que algo se vea bonito, tiene que estar bien escrito.*

**8 minutos · 7 puntos · HTML semántico: estructura del documento, encabezados, listas, tablas y enlaces**

Levante el esqueleto del tablero en HTML puro. Sin una sola línea de CSS: hoy el tablero se ve feo a propósito.

**Qué debe hacer**

- Cree `index.html` con la estructura básica de un documento HTML5: `lang="es"`, `charset`, `viewport` y un `<title>` con el nombre de su torneo.
- Arme la página con etiquetas semánticas: `<header>` con el nombre del torneo y la letra de la ronda, `<main>` con el tablero, `<aside>` con las reglas y `<footer>` con su nombre y el grupo.
- Dentro del `<main>`, construya la tabla de la ronda con `<table>`, `<caption>`, `<thead>` y `<tbody>`: una columna por cada una de las seis categorías y una fila por jugador (mínimo tres jugadores).
- En el `<aside>`, escriba las reglas del torneo en una lista ordenada y las seis categorías en una lista no ordenada.
- Agregue un enlace interno que lleve desde el encabezado hasta la sección de reglas usando un `id`.
- **Todo el contenido que invente debe empezar por la letra sorteada**: nombres de jugadores, respuestas de las casillas y hasta el nombre del torneo.

**Cómo se verifica.** La página abre en el navegador, se entiende sin estilos y el esquema de encabezados va de `h1` a `h3` sin saltos.

**Pista.** Si quita todo el CSS y la página sigue contándose sola, el HTML está bien. Use `<th scope="col">` en los encabezados de la tabla: es una línea y mejora la accesibilidad.

<sub>Errores frecuentes: Usar `<div>` para todo; poner varios `h1`; tablas sin `thead`; inventar contenido que no respeta la letra sorteada.</sub>

#### Ronda 2 — La hoja de respuestas

*En STOP, quien no escribe a tiempo no puntúa. En la web, quien no valida recibe basura.*

**8 minutos · 8 puntos · Formularios HTML5: campos, etiquetas, validación nativa y multimedia**

Agregue al tablero la hoja donde el jugador escribe sus seis respuestas, con la validación que el árbitro ya no quiere hacer a mano.

**Qué debe hacer**

- Dentro de un `<form>`, cree un `<fieldset>` con `<legend>` y un campo por cada una de las seis categorías.
- Cada campo lleva su `<label for="...">` correctamente asociado, `name`, `placeholder` y el atributo `required`.
- Use el atributo `pattern` para exigir que la respuesta empiece por la letra de la ronda y tenga al menos tres letras. Agregue `title` explicando la regla.
- Incluya un `<select>` con las letras disponibles del torneo y un `<input type="number">` con el número de ronda (`min`, `max`).
- Agregue el sonido del timbre con `<audio controls>` y el escudo del torneo con `<img>` y su `alt` descriptivo. Si no tiene archivos, use rutas relativas a una carpeta `recursos/` y deje los archivos vacíos: lo que se evalúa es el marcado.
- Termine con dos botones: `<button type="submit">¡STOP!</button>` y uno de tipo `reset`.

**Cómo se verifica.** Al enviar el formulario vacío el navegador bloquea el envío; al escribir una palabra que no empieza por la letra, el campo queda inválido.

**Pista.** Un patrón que sirve para la letra M: `pattern="[Mm][A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}"`. Sin `title`, el navegador muestra un mensaje genérico que nadie entiende.

<sub>Errores frecuentes: Etiquetas `label` sin `for`; `pattern` sin anclar a la letra; olvidar `alt` en la imagen; poner `type="button"` donde debía ir `submit`.</sub>

### Bloque CSS

#### Ronda 3 — Los colores del torneo

*Un torneo sin identidad visual parece una hoja de cálculo.*

**6 minutos · 5 puntos · Guía de estilo: paleta de color, tipografía, variables CSS y jerarquía visual**

Defina la identidad de su torneo y déjela escrita en código, no en su cabeza.

**Qué debe hacer**

- Cree `estilos.css` y enlácelo desde el HTML.
- Declare en `:root` al menos seis variables CSS: tres de color (principal, acento y fondo), dos de texto y una de radio o espaciado.
- Defina dos familias tipográficas con su pila de respaldo: una para títulos y otra para el cuerpo. Si usa Google Fonts, enlácela; si no hay red, use fuentes del sistema.
- Escriba una escala tipográfica de al menos cuatro tamaños y aplíquela a `h1`, `h2`, `h3` y al cuerpo.
- Documente la paleta en un comentario al inicio del archivo: nombre del color, para qué se usa y su código hexadecimal.

**Cómo se verifica.** El archivo tiene un bloque `:root` con las variables y ningún color escrito a mano más abajo: todo se usa con `var(--...)`.

**Pista.** Tres colores bien escogidos se ven mejor que ocho. Si no sabe por dónde empezar, tome un color principal, su versión oscura para texto y un neutro muy claro para el fondo.

<sub>Errores frecuentes: Declarar variables y después escribir los hexadecimales a mano; usar más de dos tipografías; escalas tipográficas de dos tamaños.</sub>

#### Ronda 4 — Caja por caja

*Todo en la web es una caja. El que entiende el modelo de cajas deja de pelear con los espacios.*

**8 minutos · 7 puntos · Modelo de cajas, selectores, especificidad y estilos de tabla y formulario**

Convierta el tablero de papel de la Ronda 1 en algo que se pueda proyectar sin vergüenza.

**Qué debe hacer**

- Aplique `box-sizing: border-box` a todo el documento y explique en un comentario por qué.
- Estilice la tabla: bordes, relleno de celdas, encabezado con fondo de color y filas alternas con `:nth-child(even)`.
- Estilice el formulario: ancho de los campos, separación entre ellos, bordes y radios tomados de sus variables.
- Use al menos cuatro tipos de selector distintos: de etiqueta, de clase, descendiente y de atributo (por ejemplo `input[type="number"]`).
- Dele al `<header>` un tratamiento propio que destaque la letra sorteada como el elemento más grande de la pantalla.

**Cómo se verifica.** La letra de la ronda es lo primero que se ve al proyectar la página, y la tabla se lee de corrido sin esfuerzo.

**Pista.** Margen, borde, relleno y contenido: cuando algo «no cabe», casi siempre es el relleno sumándose al ancho. De ahí el `border-box`.

<sub>Errores frecuentes: Abusar de `!important`; estilos escritos en el atributo `style`; especificidad escalada con selectores de cinco niveles.</sub>

#### Ronda 5 — Botones que responden

*Un botón que no cambia al pasar el mouse parece una fotografía.*

**8 minutos · 7 puntos · Componentes, pseudo-clases y estados visuales de formularios**

Haga que el tablero reaccione a lo que el jugador hace, usando solo CSS.

**Qué debe hacer**

- Diseñe el botón `¡STOP!` como componente: estado normal, `:hover`, `:focus-visible` y `:active`.
- Agregue el estado `:disabled` con una apariencia claramente distinta y explique en un comentario cuándo se usaría.
- Marque visualmente los campos con `:valid` e `:invalid` (por ejemplo, borde verde y borde rojo), pero solo después de que el usuario escriba: use `:not(:placeholder-shown)`.
- Convierta cada bloque de reglas del `<aside>` en una tarjeta con sombra y borde redondeado.
- Resalte la fila de la tabla bajo el cursor con `tr:hover`.

**Cómo se verifica.** Al recorrer la página con la tecla Tab se ve siempre dónde está el foco, y los campos cambian de color según lo escrito.

**Pista.** `:focus-visible` en lugar de `:focus` evita el anillo cuando se hace clic con el mouse, pero lo conserva para quien navega con teclado. Nunca escriba `outline: none` sin poner algo en su lugar.

<sub>Errores frecuentes: Quitar el contorno del foco; pintar los campos de rojo apenas cargan la página; tarjetas sin separación entre ellas.</sub>

#### Ronda 6 — El cronómetro entra en pánico

*Los últimos diez segundos de una ronda de STOP son los más largos del mundo.*

**8 minutos · 7 puntos · Transiciones, animaciones con @keyframes y efectos de estado**

Ponga la tensión del juego en la pantalla, sin JavaScript todavía.

**Qué debe hacer**

- Agregue al encabezado un cronómetro visual: un elemento con el número de segundos y una barra que lo acompañe.
- Cree una animación con `@keyframes` que haga latir el cronómetro, y aplíquela con `animation` en bucle.
- Agregue una transición suave a los botones y a las tarjetas (color, sombra o escala). Nada de transiciones de 2 segundos: entre 150 y 300 ms.
- Cree una clase `.ultimos-segundos` que cambie la animación a algo claramente más urgente. Aplíquela a mano en el HTML por ahora; en la Ronda 10 la pondrá el JavaScript.
- Respete a quien marea el movimiento: envuelva las animaciones en `@media (prefers-reduced-motion: reduce)` para desactivarlas.

> **¡STOP SORPRESA! · El torneo también se juega de noche**
>
> La final es a las ocho de la noche en un auditorio a media luz y los jugadores se quejan de la pantalla blanca.
>
> Agregue modo oscuro con `@media (prefers-color-scheme: dark)` redefiniendo las variables de `:root`. Si su paleta de la Ronda 3 está bien hecha, esto le cuesta ocho líneas. Si no, le cuesta la ronda.
>

**Cómo se verifica.** El cronómetro late, los botones transicionan, el modo oscuro cambia la página completa y con movimiento reducido todo se queda quieto.

**Pista.** Anime `transform` y `opacity` antes que `width`, `top` o `margin`: el navegador los resuelve sin recalcular el diseño y se ve más fluido.

<sub>Errores frecuentes: Animar todo al tiempo; usar `transition: all`; redefinir colores dentro de cada regla en lugar de cambiar las variables en el bloque de modo oscuro.</sub>

#### Ronda 7 — El tablero cabe en el bolsillo

*La mitad del torneo se va a jugar desde un celular en una cafetería.*

**9 minutos · 8 puntos · CSS Grid, diseño responsive con media queries y utilidades de Bootstrap**

Haga que el mismo tablero funcione en el proyector del auditorio y en el celular de un jugador.

**Qué debe hacer**

- Organice el diseño general con CSS Grid: encabezado, tablero y panel de reglas en una grilla con `grid-template-areas` nombradas.
- En pantallas anchas, el panel de reglas va al lado del tablero; en pantallas angostas, debajo.
- Escriba al menos dos `@media` (por ejemplo en 768 px y 1100 px) y verifique el resultado en tres anchos distintos.
- Resuelva la tabla en móvil: permita desplazamiento horizontal con un contenedor `overflow-x: auto` o reorganice las celdas, pero que nada se desborde de la pantalla.
- Use el sistema de grillas o alguna utilidad de Bootstrap en al menos una sección y deje un comentario explicando qué resolvió Bootstrap y qué resolvió su propio CSS.

**Cómo se verifica.** A 375, 768 y 1280 px de ancho no aparece barra de desplazamiento horizontal en la página y todo el contenido se lee.

**Pista.** `grid-template-areas` permite reordenar el diseño completo dentro de la media query cambiando solo el dibujo de las áreas, sin tocar el HTML.

<sub>Errores frecuentes: Diseñar solo para el portátil propio; anchos fijos en píxeles; media queries que se contradicen por el orden en que están escritas.</sub>

### Bloque JavaScript

#### Ronda 8 — El árbitro calculista

*La discusión de todo torneo de STOP es la misma: ¿esa respuesta vale 100 o 50?*

**9 minutos · 9 puntos · Variables, tipos, operadores, condicionales, ciclos, objetos y arreglos**

Escriba en JavaScript las reglas que hoy se resuelven gritando.

**Qué debe hacer**

- Cree `js/datos.js` con un arreglo de objetos: una ronda jugada con al menos tres jugadores, cada uno con su nombre y sus seis respuestas. Todo debe empezar por la letra sorteada.
- Cree `js/puntaje.js` con la función `puntuarRespuesta(respuesta, letra, repetida)` que devuelva 100, 50 o 0 según las reglas del torneo.
- Escriba `puntuarJugador(jugador, letra, todasLasRespuestas)` que recorra las seis categorías y sume el puntaje del jugador.
- Escriba `calcularMarcador(ronda, letra)` que devuelva un arreglo de `{ jugador, puntaje }` ordenado de mayor a menor.
- Use `const` y `let` donde corresponde, al menos un ciclo y al menos una estructura de decisión. Nada de variables globales sueltas.
- Exporte las funciones con `export` y pruébelas desde la consola del navegador con un módulo `type="module"`.

**Cómo se verifica.** Con la ronda de ejemplo del kit, `calcularMarcador` devuelve el mismo marcador que usted calcularía a mano.

**Pista.** Una respuesta está repetida si aparece más de una vez en la misma categoría entre todos los jugadores. Normalice antes de comparar: minúsculas y sin espacios al borde.

<sub>Errores frecuentes: Comparar con `==`; funciones que imprimen en consola en vez de devolver un valor; contar la repetición mirando solo al jugador siguiente.</sub>

#### Ronda 9 — La palabra tramposa

*«Zzz» empieza por Z, tiene tres letras y no es un animal. El árbitro necesita mejores reglas.*

**8 minutos · 8 puntos · Expresiones regulares, funciones, alcance y módulos**

Separe lo que es una respuesta válida de lo que es un intento de colarse.

**Qué debe hacer**

- Cree `js/validar.js` con la función `esRespuestaValida(respuesta, letra)`.
- La respuesta debe empezar por la letra sorteada sin importar mayúsculas, tener mínimo tres caracteres y contener solo letras, espacios, tildes o guiones: resuélvalo con una expresión regular.
- Rechace las respuestas de una sola letra repetida (`aaa`, `mmm`) con una segunda expresión regular.
- Escriba `normalizar(texto)` que recorte espacios y pase a minúscula, y úsela desde las dos funciones anteriores.
- Integre la validación con la Ronda 8: una respuesta inválida siempre vale 0 puntos, aunque no esté repetida.
- Documente cada función con un comentario de una línea que diga qué recibe y qué devuelve.

**Cómo se verifica.** Pruebe los casos: válida, vacía, con letra equivocada, con números, de dos caracteres y de una letra repetida. Las seis deben comportarse como manda la regla.

**Pista.** Construya la expresión con `new RegExp()` para poder insertar la letra sorteada, y pruébela con `.test()`. Las banderas `i` y `u` le ahorran problemas con mayúsculas y tildes.

<sub>Errores frecuentes: Una expresión regular tan larga que ni usted la entiende; validar con una cadena de `if` cuando la regla cabe en un patrón; olvidar el caso del campo vacío.</sub>

#### Ronda 10 — ¡STOP!

*La ronda termina cuando alguien golpea el botón. Ese botón es suyo.*

**10 minutos · 10 puntos · DOM, eventos, temporizadores, clases y organización de archivos**

Conecte todo lo que escribió: el tablero, el formulario, el árbitro y el cronómetro.

**Qué debe hacer**

- Cree `js/app.js` como módulo que importe las funciones de los retos 8 y 9.
- Al cargar la página, sortee la letra de la ronda con `Math.random()` sobre un arreglo de letras permitidas y muéstrela en el encabezado.
- Implemente el cronómetro con `setInterval`: cuenta regresiva de 60 segundos, y cuando falten diez agregue la clase `.ultimos-segundos` que creó en la Ronda 6.
- Al hacer clic en `¡STOP!`, detenga el cronómetro, lea las respuestas del formulario, valídelas y pinte el resultado en la tabla sin recargar la página.
- Cree una clase `Ronda` con sus propiedades y al menos dos métodos (`iniciar()` y `detener()`), y úsela como dueña del estado de la ronda.
- Deje la consola limpia: sin errores y sin `console.log` de depuración olvidados.

> **¡STOP SORPRESA! · Cambio de reglamento a mitad del torneo**
>
> El comité decide que una respuesta repetida por **tres o más** jugadores ya no vale 50 sino 25 puntos.
>
> Haga el cambio donde debe hacerse: en una sola función de la Ronda 8, sin tocar el DOM ni copiar lógica. Si el cambio le obliga a editar tres archivos, su código estaba mal repartido y esa es justamente la lección.
>

**Cómo se verifica.** Abre la página, se sortea la letra, el cronómetro corre, el botón ¡STOP! calcula el marcador y lo muestra en pantalla.

**Pista.** Guarde el identificador que devuelve `setInterval` para poder pasarlo a `clearInterval`. Un cronómetro que no se puede detener es el error más común de esta ronda.

<sub>Errores frecuentes: Scripts sin `type="module"`; leer el DOM antes de que exista; `innerHTML` reconstruyendo la tabla completa en cada tick; dejar el intervalo corriendo después del STOP.</sub>

### Bloque React

#### Ronda 11 — El tablero se vuelve componente

*Lo mismo que ya funciona, ahora dicho en el idioma de React.*

**8 minutos · 8 puntos · React con TypeScript: proyecto con Vite, JSX, componentes funcionales y tipos**

Traduzca el encabezado de su tablero a React sin perder nada de lo que ya tenía.

**Qué debe hacer**

- Cree el proyecto con `npm create vite@latest tablero -- --template react-ts` dentro de su repositorio.
- Cree `src/tipos.ts` con las interfaces del torneo: `Respuesta`, `Jugador` (nombre y sus seis respuestas) y `Ronda` (letra, número y jugadores).
- Porte a `src/puntaje.ts` las funciones de los retos 8 y 9, ahora con tipos en los parámetros y en el valor de retorno. Nada de `any`.
- Cree el componente `Encabezado.tsx` que reciba por props la letra, el número de ronda y los segundos restantes, y los muestre en JSX.
- Renderice `Encabezado` desde `App.tsx` pasándole datos escritos a mano.
- **No use estado en esta ronda ni en las siguientes**: todo entra por props. El estado se verá en la próxima unidad del curso.

**Cómo se verifica.** El proyecto arranca con `npm run dev` y el encabezado muestra la letra, la ronda y los segundos que llegaron por props.

**Pista.** Declare las props con una `interface Props` encima del componente y desestructúrelas en la firma: `function Encabezado({ letra, ronda }: Props)`. Es la forma que verá en todo código React con TypeScript.

<sub>Errores frecuentes: Tipar las props como `any` o como `object`; nombrar los componentes en minúscula; escribir `class=` en lugar de `className=`.</sub>

#### Ronda 12 — Una fila por jugador

*Tres jugadores se copian y pegan. Ciento veinte, no.*

**8 minutos · 9 puntos · Composición de componentes, props tipadas, listas con .map, keys y renderizado condicional**

Convierta la tabla en componentes que se repiten solos.

**Qué debe hacer**

- Cree `CeldaRespuesta.tsx`: recibe por props el texto de la respuesta y si es válida, y muestra un indicador distinto en cada caso (renderizado condicional).
- Cree `FilaJugador.tsx`: recibe un jugador y la letra, y renderiza sus seis celdas con `.map()` usando una `key` estable.
- Cree `TableroRonda.tsx`: recibe el arreglo de jugadores y renderiza una `FilaJugador` por cada uno, también con `.map()` y `key`.
- Agregue una prop opcional con valor por defecto (por ejemplo `mostrarPuntaje = true`) y úsela para mostrar u ocultar la columna de puntos.
- Si la ronda llega sin jugadores, muestre un mensaje en lugar de una tabla vacía.
- La consola del navegador no debe reportar ninguna advertencia sobre `key`.

**Cómo se verifica.** Agregar un jugador al arreglo de datos hace aparecer una fila nueva sin tocar ningún componente.

**Pista.** La `key` debe ser estable y única: el nombre del jugador sirve, el índice del `.map()` no. Un componente que recibe datos y no los modifica se prueba cambiando solo el arreglo de entrada.

<sub>Errores frecuentes: Usar el índice como `key`; repetir el marcado de la fila dentro del tablero en vez de componer; pasar quince props sueltas cuando cabía un objeto tipado.</sub>

#### Ronda 13 — La final

*El marcador en pantalla y el torneo cerrado. Eso es todo lo que pedía Bienestar.*

**7 minutos · 7 puntos · Composición en varios niveles, props calculadas, children y entrega del producto**

Arme la pantalla final del torneo componiendo todo lo que construyó.

**Qué debe hacer**

- Cree `Marcador.tsx`: recibe el arreglo de `{ jugador, puntaje }` que devuelve su función de la Ronda 8 y lo muestra ordenado, destacando al primer lugar.
- Cree `Panel.tsx`: un contenedor que reciba un título por props y el contenido por `children`, y úselo para envolver el tablero y el marcador.
- En `App.tsx` arme la composición completa: `Encabezado`, `Panel` con `TableroRonda` y `Panel` con `Marcador`, alimentados por la ronda que jugó en clase.
- Los puntajes no se escriben a mano: se calculan llamando a sus funciones de `puntaje.ts` y se pasan por props.
- Traslade al proyecto React la identidad visual de la Ronda 3: las mismas variables de color y la misma tipografía.

> **¡STOP RELÁMPAGO! · Séptima categoría**
>
> El comité agrega la categoría «Película» al torneo.
>
> Debe aparecer en el tablero **sin modificar** `CeldaRespuesta` ni `FilaJugador`: solo cambiando los datos y los tipos. Si tuvo que tocar los componentes, anótelo en la bitácora y explique qué haría distinto.
>

**Cómo se verifica.** La aplicación muestra encabezado, tablero y marcador, el primer lugar se distingue a simple vista y la séptima categoría aparece sin haber editado los componentes de fila y celda.

**Pista.** Si `FilaJugador` recorre las categorías con `.map()` en vez de nombrarlas una por una, la séptima categoría entra sola. Ese es el premio de haber hecho bien la Ronda 12.

<sub>Errores frecuentes: Quemar los puntajes en el JSX; componentes de más de cien líneas; perder la identidad visual al pasar a React.</sub>

## 8. Bonos

| Bono | Qué hay que hacer | Puntos |
|---|---|---|
| Respuesta única | Al cierre, el profesor muestra tres detalles del tablero (una animación, un componente o una solución de diseño). Si el suyo no lo repitió nadie más, suma como en STOP. | +3 |
| Accesibilidad | Navegación completa con teclado, contraste suficiente y atributos ARIA donde hagan falta, justificados en una línea del README. | +2 |
| Séptima categoría | Resolver el STOP RELÁMPAGO de la Ronda 13 sin modificar los componentes de fila y celda. | +2 |

## 9. Cómo se reparte el tiempo

| Hora | Duración | Momento | Al terminar debe tener |
|---|---|---|---|
| 00:00 | 5 min | Sorteo de la letra y briefing | La letra del torneo anotada en el tablero |
| 00:05 | 16 min | Rondas 1 y 2 · HTML | Tablero semántico y hoja de respuestas validada |
| 00:21 | 30 min | Rondas 3 a 6 · CSS | Identidad visual, cajas, estados y animación |
| 00:51 | 9 min | Ronda 7 · Grid y responsive | El tablero funciona en tres anchos |
| 01:00 | 27 min | Rondas 8 a 10 · JavaScript | Árbitro, validación y botón ¡STOP! funcionando |
| 01:27 | 23 min | Rondas 11 a 13 · React con TypeScript | Tablero y marcador en componentes |
| 01:50 | 10 min | Cierre: bitácora, árbitro y entrega | Repositorio entregado |
| 02:00 | — | Fin del torneo |  |

Si una ronda se le atraviesa más de dos minutos sobre lo previsto, anote en la bitácora dónde quedó y pase a la siguiente. Quedarse trabado en la Ronda 6 y no llegar a React cuesta mucho más que perder la Ronda 6.

## 10. El árbitro

Desde la carpeta del kit, apuntando a su proyecto:

```bash
node arbitro.mjs ../mi-torneo-stop
```

Lee sus archivos y reparte un sello por ronda. Tres resultados posibles: **SELLO** (todo lo que busca está), **CASI** (le falta poco y le dice qué) y **FALTA**.

El árbitro revisa que las cosas **estén**; su profesor revisa que **funcionen**. Pasar el árbitro no garantiza la nota, pero no pasarlo casi siempre significa que falta algo de verdad.

Ejecútelo al terminar la Ronda 7 y otra vez al terminar la Ronda 10. No espere al final.

## 11. Puntaje

| Ronda | Temática | Puntos |
|---|---|---|
| 1. El tablero de papel | HTML semántico | 7 |
| 2. La hoja de respuestas | Formularios HTML5 | 8 |
| 3. Los colores del torneo | Guía de estilo | 5 |
| 4. Caja por caja | Modelo de cajas, selectores, especificidad y estilos de tabla y formulario | 7 |
| 5. Botones que responden | Componentes, pseudo-clases y estados visuales de formularios | 7 |
| 6. El cronómetro entra en pánico | Transiciones, animaciones con @keyframes y efectos de estado | 7 |
| 7. El tablero cabe en el bolsillo | CSS Grid, diseño responsive con media queries y utilidades de Bootstrap | 8 |
| 8. El árbitro calculista | Variables, tipos, operadores, condicionales, ciclos, objetos y arreglos | 9 |
| 9. La palabra tramposa | Expresiones regulares, funciones, alcance y módulos | 8 |
| 10. ¡STOP! | DOM, eventos, temporizadores, clases y organización de archivos | 10 |
| 11. El tablero se vuelve componente | React con TypeScript | 8 |
| 12. Una fila por jugador | Composición de componentes, props tipadas, listas con .map, keys y renderizado condicional | 9 |
| 13. La final | Composición en varios niveles, props calculadas, children y entrega del producto | 7 |
| | **Total** | **100** |

Dentro de cada ronda, como en STOP: **100 %** si el criterio está completo y correcto, **50 %** si está a medias o funciona con fallas, **0** si no está.

| Nivel | Rango | Qué significa |
|---|---|---|
| Excelente | 90–100 | El tablero funciona completo, el código está repartido con criterio y los componentes reciben todo por props. |
| Bueno | 75–89 | Funciona casi todo; fallan detalles de validación, accesibilidad o tipado. |
| Básico | 60–74 | El tablero en HTML, CSS y JavaScript funciona, pero React quedó incompleto. |
| Insuficiente | < 60 | El tablero no se sostiene: falta marcado, estilos o lógica. |

## 12. Entrega

Al minuto 110 deje de programar y dedique los últimos diez minutos a esto:

1. Diligencie `BITACORA.md` en la raíz del repositorio, incluyendo los comodines que usó.
2. Ejecute `node arbitro.mjs` y pegue el resultado en la bitácora.
3. Verifique que `.gitignore` excluye `node_modules/`.
4. Commit final: `git commit -m "entrega final"`.
5. Suba el repositorio a la plataforma del curso.

**Lista de verificación**

- [ ] La página se entiende sin CSS (HTML semántico)
- [ ] El formulario valida con `required` y `pattern`
- [ ] La paleta y la tipografía están en variables de `:root`
- [ ] La tabla y el formulario están estilizados
- [ ] Los botones tienen hover, foco y estado deshabilitado
- [ ] El cronómetro late y hay modo oscuro
- [ ] El tablero funciona a 375, 768 y 1280 px
- [ ] Las funciones de puntaje devuelven 100, 50, 25 o 0
- [ ] La validación con expresión regular pasa los seis casos de prueba
- [ ] El botón ¡STOP! detiene el cronómetro y pinta el marcador
- [ ] El proyecto React arranca y el encabezado recibe props
- [ ] La tabla se renderiza con `.map()` y `key` estable
- [ ] El marcador se calcula, no se escribe a mano
- [ ] Todo el contenido empieza por la letra sorteada
- [ ] Hay un commit por ronda y la bitácora está diligenciada

---

<sub>UNIVERSIDAD DEL ROSARIO · Escuela de Ingeniería, Ciencia y Tecnología · Electiva de Desarrollo Web · Parcial práctico STOP</sub>
