import './Footer.css';

interface FooterProps {
  nombreSitio: string;
  direccion: string;
  anio: number;
}

export function Footer({ nombreSitio, direccion, anio }: FooterProps) {
  return (
    <footer className="footer" id="contacto">
      <div className="footer__contenido">
        <div className="footer__marca">
          <span className="footer__logo" aria-hidden="true">
            CA
          </span>
          <p className="footer__nombre">{nombreSitio}</p>
        </div>
        <address className="footer__direccion">{direccion}</address>
        <p className="footer__copyright">
          &copy; {anio} {nombreSitio}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}