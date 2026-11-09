interface CargandoProps {
  texto?: string; // el signo ? indica que la prop es opcional
}

export function Cargando({ texto = 'Cargando...' }: CargandoProps) {
  return (
    <div className="cargando" role="status">
      <span className="cargando__spinner" aria-hidden="true" />
      <span>{texto}</span>
    </div>
  );
}
