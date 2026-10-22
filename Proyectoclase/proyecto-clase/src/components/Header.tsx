import './Header.css';

/** Un enlace del menú de navegación. */
interface Enlace {
  texto: string;
  href: string;
}

// PROPS TIPADAS: la interfaz describe qué recibe el componente.
interface HeaderProps {
  nombreSitio: string;
  enlaces: Enlace[];
  version?: string; // el "?" la hace OPCIONAL: se puede enviar o no
}

export function Header({ nombreSitio, enlaces, version }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__marca">
        <span className="header__logo" aria-hidden="true">
          CA
        </span>
        <h1 className="header__titulo">{nombreSitio}</h1>
        {/* Renderizado condicional: la versión solo aparece si se envió */}
        {version && <span className="header__version">v{version}</span>}
      </div>

      <nav aria-label="Navegación principal">
        <ul className="header__menu">
          {/* map() crea un <li> por cada enlace; key debe ser única */}
          {enlaces.map((enlace) => (
            <li key={enlace.href}>
              <a href={enlace.href}>{enlace.texto}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
