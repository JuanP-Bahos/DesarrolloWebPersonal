// Las props son los "parámetros" de un componente. Su forma se describe con una interfaz.
interface EncabezadoProps {
  titulo: string;
  subtitulo: string;
}

export function Encabezado({ titulo, subtitulo }: EncabezadoProps) {
  return (
    <header className="encabezado">
      <div className="encabezado__contenido">
        <div className="encabezado__logo" aria-hidden="true">
          SF
        </div>
        <div>
          <h1 className="encabezado__titulo">{titulo}</h1>
          <p className="encabezado__subtitulo">{subtitulo}</p>
        </div>
      </div>
    </header>
  );
}
