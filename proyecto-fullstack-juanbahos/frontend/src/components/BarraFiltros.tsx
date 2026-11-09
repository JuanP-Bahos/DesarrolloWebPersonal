import { CATEGORIAS, type Categoria } from '../types/producto';

export type FiltroCategoria = Categoria | 'Todas';

interface BarraFiltrosProps {
  busqueda: string;
  categoria: FiltroCategoria;
  onBusquedaChange: (texto: string) => void;
  onCategoriaChange: (categoria: FiltroCategoria) => void;
}

/**
 * Campo de búsqueda y selector de categoría.
 * Es un componente "controlado": no guarda estado propio; recibe los valores
 * por props y avisa al padre cada vez que el usuario los cambia.
 */
export function BarraFiltros({ busqueda, categoria, onBusquedaChange, onCategoriaChange }: BarraFiltrosProps) {
  return (
    <div className="filtros">
      <input
        type="search"
        className="campo__control"
        placeholder="Buscar por nombre o código..."
        aria-label="Buscar producto"
        value={busqueda}
        onChange={(evento) => onBusquedaChange(evento.target.value)}
      />
      <select
        className="campo__control"
        aria-label="Filtrar por categoría"
        value={categoria}
        onChange={(evento) => onCategoriaChange(evento.target.value as FiltroCategoria)}
      >
        <option value="Todas">Todas las categorías</option>
        {CATEGORIAS.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    </div>
  );
}
