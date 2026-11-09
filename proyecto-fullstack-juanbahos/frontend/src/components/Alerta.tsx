export interface MensajeAlerta {
  tipo: 'exito' | 'error';
  texto: string;
  detalles?: string[];
}

interface AlertaProps {
  mensaje: MensajeAlerta;
  onCerrar: () => void;
}

/** Caja de mensaje de éxito (verde) o de error (roja), con lista opcional de detalles. */
export function Alerta({ mensaje, onCerrar }: AlertaProps) {
  return (
    <div className={`alerta alerta--${mensaje.tipo}`} role={mensaje.tipo === 'error' ? 'alert' : 'status'}>
      <div>
        <strong>{mensaje.texto}</strong>
        {mensaje.detalles && mensaje.detalles.length > 0 && (
          <ul className="alerta__detalles">
            {mensaje.detalles.map((detalle) => (
              <li key={detalle}>{detalle}</li>
            ))}
          </ul>
        )}
      </div>
      <button type="button" className="alerta__cerrar" aria-label="Cerrar mensaje" onClick={onCerrar}>
        ×
      </button>
    </div>
  );
}
