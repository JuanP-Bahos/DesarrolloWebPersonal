#!/usr/bin/env node
/**
 * EL ÁRBITRO — verificador del Torneo de STOP
 *
 * Uso:   node arbitro.mjs            (revisa la carpeta actual)
 *        node arbitro.mjs ../mi-torneo
 *
 * Lee sus archivos .html, .css, .js, .ts y .tsx y reparte un sello por ronda.
 * No ejecuta nada: revisa el marcado y el código. Es un árbitro, no un juez:
 * puede equivocarse en los dos sentidos, así que úselo como lista de chequeo
 * rápida y no como su nota final. Requiere Node 20 o superior.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const RAIZ = process.argv[2] ?? '.';
const IGNORAR = new Set(['node_modules', '.git', 'dist', 'build', '.vite', 'rescate']);

function recolectar(dir, acumulado = []) {
  let entradas;
  try {
    entradas = readdirSync(dir);
  } catch {
    console.error(`\n  No se puede leer la carpeta "${dir}".\n`);
    process.exit(1);
  }

  for (const entrada of entradas) {
    if (IGNORAR.has(entrada) || entrada.startsWith('.')) continue;
    const ruta = join(dir, entrada);
    const info = statSync(ruta);
    if (info.isDirectory()) recolectar(ruta, acumulado);
    else if (['.html', '.css', '.js', '.mjs', '.ts', '.tsx', '.jsx'].includes(extname(entrada))) {
      acumulado.push({ ruta, ext: extname(entrada), texto: readFileSync(ruta, 'utf-8') });
    }
  }
  return acumulado;
}

const archivos = recolectar(RAIZ).filter((a) => !a.ruta.includes('arbitro'));

const porExt = (...exts) => archivos.filter((a) => exts.includes(a.ext)).map((a) => a.texto).join('\n');
const HTML = porExt('.html');
const CSS = porExt('.css');
const JS = porExt('.js', '.mjs');
const TSX = porExt('.tsx', '.ts', '.jsx');
const TODO = HTML + CSS + JS + TSX;

const tiene = (fuente, patron) => (patron instanceof RegExp ? patron : new RegExp(patron, 'i')).test(fuente);
const cuenta = (fuente, patron) => (fuente.match(patron) ?? []).length;

/* ---------------- definición de las rondas ---------------- */
const RONDAS = [
  {
    n: 1, titulo: 'El tablero de papel', pruebas: [
      ['Etiquetas semánticas (header, main, aside, footer)', ['<header', '<main', '<aside', '<footer'].every((t) => tiene(HTML, t))],
      ['Tabla con caption, thead y tbody', ['<caption', '<thead', '<tbody'].every((t) => tiene(HTML, t))],
      ['Encabezados de columna con scope', tiene(HTML, /<th[^>]*scope=/i)],
      ['Lista ordenada y lista no ordenada', tiene(HTML, '<ol') && tiene(HTML, '<ul')],
      ['Enlace interno con ancla', tiene(HTML, /href="#[\w-]+"/i)],
      ['Un solo h1', cuenta(HTML, /<h1[\s>]/gi) === 1]
    ]
  },
  {
    n: 2, titulo: 'La hoja de respuestas', pruebas: [
      ['Formulario con fieldset y legend', tiene(HTML, '<form') && tiene(HTML, '<fieldset') && tiene(HTML, '<legend')],
      ['Seis o más etiquetas label con for', cuenta(HTML, /<label[^>]+for=/gi) >= 6],
      ['Campos obligatorios (required)', cuenta(HTML, /required/gi) >= 6],
      ['Validación con pattern y title', tiene(HTML, /pattern=/i) && tiene(HTML, /title=/i)],
      ['Select y campo numérico con min y max', tiene(HTML, '<select') && tiene(HTML, /type="number"[^>]*min=/i)],
      ['Multimedia: audio e imagen con alt', tiene(HTML, '<audio') && tiene(HTML, /<img[^>]+alt=/i)],
      ['Botón de envío', tiene(HTML, /<button[^>]*type="submit"/i)]
    ]
  },
  {
    n: 3, titulo: 'Los colores del torneo', pruebas: [
      ['Bloque :root con seis o más variables', cuenta(CSS, /--[\w-]+\s*:/g) >= 6],
      ['Las variables se usan con var()', cuenta(CSS, /var\(--/g) >= 8],
      ['Dos familias tipográficas declaradas', cuenta(CSS, /font-family\s*:/gi) >= 2],
      ['Escala de al menos cuatro tamaños', cuenta(CSS, /font-size\s*:/gi) >= 4],
      ['Paleta documentada en un comentario', tiene(CSS, /\/\*[\s\S]{40,}\*\//)]
    ]
  },
  {
    n: 4, titulo: 'Caja por caja', pruebas: [
      ['box-sizing: border-box', tiene(CSS, /box-sizing\s*:\s*border-box/i)],
      ['Tabla estilizada (border-collapse o bordes de celda)', tiene(CSS, /border-collapse/i) || tiene(CSS, /\b(th|td)\b[^{]*\{[^}]*border/i)],
      ['Filas alternas con :nth-child', tiene(CSS, /:nth-child\(/i)],
      ['Selector de atributo', tiene(CSS, /\[[\w-]+\s*[~^$*|]?=\s*["'][^"']+["']\]/)],
      ['Relleno y márgenes declarados', cuenta(CSS, /\bpadding\b/gi) >= 4 && cuenta(CSS, /\bmargin\b/gi) >= 2]
    ]
  },
  {
    n: 5, titulo: 'Botones que responden', pruebas: [
      ['Estado :hover', tiene(CSS, /:hover/)],
      ['Foco visible (:focus o :focus-visible)', tiene(CSS, /:focus(-visible)?/)],
      ['Estado :disabled', tiene(CSS, /:disabled/)],
      ['Estados de validación :valid / :invalid', tiene(CSS, /:valid/) && tiene(CSS, /:invalid/)],
      ['Tarjetas con sombra y radio', tiene(CSS, /box-shadow/i) && tiene(CSS, /border-radius/i)]
    ]
  },
  {
    n: 6, titulo: 'El cronómetro entra en pánico', pruebas: [
      ['Animación con @keyframes', tiene(CSS, /@keyframes/i)],
      ['Propiedad animation aplicada', tiene(CSS, /\banimation\s*:/i)],
      ['Transiciones declaradas', cuenta(CSS, /\btransition\s*:/gi) >= 2],
      ['Clase .ultimos-segundos', tiene(CSS + HTML + JS + TSX, /ultimos-segundos/i)],
      ['Respeta prefers-reduced-motion', tiene(CSS, /prefers-reduced-motion/i)],
      ['STOP SORPRESA: modo oscuro', tiene(CSS, /prefers-color-scheme\s*:\s*dark/i)]
    ]
  },
  {
    n: 7, titulo: 'El tablero cabe en el bolsillo', pruebas: [
      ['Diseño con CSS Grid', tiene(CSS, /display\s*:\s*grid/i)],
      ['Áreas nombradas con grid-template-areas', tiene(CSS, /grid-template-areas/i)],
      ['Dos o más media queries de ancho', cuenta(CSS, /@media[^{]*width/gi) >= 2],
      ['La tabla no desborda (overflow-x o reorganización)', tiene(CSS, /overflow-x\s*:\s*auto|overflow\s*:\s*auto/i)],
      ['Bootstrap enlazado o utilizado', tiene(HTML, /bootstrap/i) || tiene(CSS, /bootstrap/i)]
    ]
  },
  {
    n: 8, titulo: 'El árbitro calculista', pruebas: [
      ['Arreglo de objetos con los jugadores', tiene(JS, /\[\s*\{[\s\S]{20,}\}/)],
      ['Función de puntaje por respuesta', tiene(JS, /function\s+puntuarRespuesta|const\s+puntuarRespuesta/i)],
      ['Función de puntaje por jugador', tiene(JS, /puntuarJugador/i)],
      ['Función que calcula el marcador', tiene(JS, /calcularMarcador/i)],
      ['Ciclo y estructura de decisión', (tiene(JS, /\bfor\s*\(|\bwhile\s*\(|\.map\(|\.reduce\(/) && tiene(JS, /\bif\s*\(/))],
      ['Módulos con export', cuenta(JS, /\bexport\b/g) >= 2],
      ['Sin comparaciones con == sueltas', !tiene(JS, /[^=!<>]==[^=]/)]
    ]
  },
  {
    n: 9, titulo: 'La palabra tramposa', pruebas: [
      ['Función de validación', tiene(JS, /esRespuestaValida|validarRespuesta/i)],
      ['Función normalizar', tiene(JS, /function\s+normalizar|const\s+normalizar/i)],
      ['Expresión regular construida con la letra', tiene(JS, /new RegExp\(/)],
      ['Uso de .test()', tiene(JS, /\.test\(/)],
      ['Comentario que documenta cada función', cuenta(JS, /\/\*\*|\/\/\s*\w/g) >= 3]
    ]
  },
  {
    n: 10, titulo: '¡STOP!', pruebas: [
      ['Script cargado como módulo', tiene(HTML, /type="module"/i)],
      ['Sorteo de la letra con Math.random', tiene(JS, /Math\.random/)],
      ['Cronómetro con setInterval', tiene(JS, /setInterval/)],
      ['El cronómetro se puede detener', tiene(JS, /clearInterval/)],
      ['Evento del botón ¡STOP!', tiene(JS, /addEventListener\(\s*['"](submit|click)/)],
      ['Clase Ronda con métodos', tiene(JS, /class\s+Ronda/)],
      ['Sin recargar la página (preventDefault)', tiene(JS, /preventDefault/)],
      ['Consola limpia (sin console.log olvidados)', cuenta(JS, /console\.log/g) === 0]
    ]
  },
  {
    n: 11, titulo: 'El tablero se vuelve componente', pruebas: [
      ['Proyecto React con TypeScript (.tsx)', archivos.some((a) => a.ext === '.tsx')],
      ['Archivo de tipos con interfaces', tiene(TSX, /\binterface\s+\w+/)],
      ['Funciones de puntaje portadas y tipadas', tiene(TSX, /puntuarRespuesta|calcularMarcador/i)],
      ['Componente Encabezado con props', tiene(TSX, /function\s+Encabezado|const\s+Encabezado/)],
      ['Props tipadas con interface Props', tiene(TSX, /interface\s+Props/)],
      ['Sin any', cuenta(TSX, /:\s*any\b/g) === 0],
      ['Sin estado (no se evalúa useState en este parcial)', !tiene(TSX, /useState/)]
    ]
  },
  {
    n: 12, titulo: 'Una fila por jugador', pruebas: [
      ['Componente de celda', tiene(TSX, /CeldaRespuesta/)],
      ['Componente de fila', tiene(TSX, /FilaJugador/)],
      ['Componente de tablero', tiene(TSX, /TableroRonda/)],
      ['Listas con .map y key', tiene(TSX, /\.map\(/) && tiene(TSX, /key=\{/)],
      ['Key estable (no el índice del map)', !tiene(TSX, /key=\{\s*(i|index|indice)\s*\}/)],
      ['Prop opcional con valor por defecto', tiene(TSX, /\w+\?\s*:/) && tiene(TSX, /=\s*(true|false|\d|['"])/)],
      ['Renderizado condicional', tiene(TSX, /\?\s*['"<(]|&&\s*</)]
    ]
  },
  {
    n: 13, titulo: 'La final', pruebas: [
      ['Componente Marcador', tiene(TSX, /Marcador/)],
      ['Contenedor con children', tiene(TSX, /children/)],
      ['Cuatro o más componentes propios', cuenta(TSX, /export\s+(default\s+)?function\s+[A-Z]\w+/g) >= 4],
      ['Los puntajes se calculan, no se escriben', tiene(TSX, /calcularMarcador\(/)],
      ['STOP RELÁMPAGO: séptima categoría', tiene(TSX, /Película|Pelicula/i)],
      ['Identidad visual trasladada (variables CSS)', cuenta(CSS, /--rojo|--principal|--color/gi) >= 1]
    ]
  }
];

/* ---------------- ejecución ---------------- */
console.log('\n  EL ÁRBITRO — Torneo de STOP');
console.log(`  Revisando "${RAIZ}": ${archivos.length} archivos encontrados`);
if (archivos.length === 0) {
  console.log('\n  No hay archivos para revisar. ¿Está parado en la carpeta de su proyecto?\n');
  process.exit(1);
}
console.log('  ───────────────────────────────────────────────\n');

let sellos = 0;

for (const ronda of RONDAS) {
  const pasadas = ronda.pruebas.filter(([, ok]) => ok).length;
  const total = ronda.pruebas.length;
  const sello = pasadas === total;
  const casi = !sello && pasadas >= Math.ceil(total * 0.7);
  if (sello) sellos++;

  const marca = sello ? ' SELLO ' : (casi ? '  CASI ' : ' FALTA ');
  console.log(`  [${marca}] Ronda ${String(ronda.n).padStart(2, '0')} · ${ronda.titulo}  (${pasadas}/${total})`);

  for (const [nombre, ok] of ronda.pruebas) {
    if (!ok) console.log(`             falta: ${nombre}`);
  }
}

console.log('\n  ───────────────────────────────────────────────');
console.log(`  Sellos completos: ${sellos} de ${RONDAS.length}`);
console.log('  "CASI" significa que la ronda está casi lista: mire qué falta.');
console.log('  El árbitro revisa que las cosas estén; su profesor revisa que funcionen.');
console.log('  ───────────────────────────────────────────────\n');
