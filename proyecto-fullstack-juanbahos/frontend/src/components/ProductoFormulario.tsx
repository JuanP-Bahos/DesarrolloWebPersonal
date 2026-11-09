import { useState, type ChangeEvent, type FormEvent } from 'react';
import { CATEGORIAS, type Producto, type ProductoDatos } from '../types/producto';
import {
  VALORES_INICIALES,
  convertirAProductoDatos,
  validarFormulario,
  type ErroresFormulario,
  type ValoresFormulario,
} from '../utils/validarProducto';

interface ProductoFormularioProps {
  /** null = crear un producto nuevo; un producto = editar ese producto */
  productoInicial: Producto | null;
  guardando: boolean;
  /** Devuelve true si se guardó correctamente */
  onGuardar: (datos: ProductoDatos) => Promise<boolean>;
  onCancelar: () => void;
}

/** Convierte un producto (números) en valores del formulario (texto). */
function obtenerValoresIniciales(producto: Producto | null): ValoresFormulario {
  if (!producto) return VALORES_INICIALES;
  return {
    codigo: producto.codigo,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    categoria: producto.categoria,
    precio: String(producto.precio),
    stock: String(producto.stock),
  };
}

/**
 * Formulario para crear o editar un producto.
 * Todos los inputs son CONTROLADOS: su valor vive en el estado `valores`.
 */
export function ProductoFormulario({ productoInicial, guardando, onGuardar, onCancelar }: ProductoFormularioProps) {
  const [valores, setValores] = useState<ValoresFormulario>(() => obtenerValoresIniciales(productoInicial));
  const [errores, setErrores] = useState<ErroresFormulario>({});

  const esEdicion = productoInicial !== null;

  // Un solo manejador para todos los campos: usa el atributo "name" del input.
  function manejarCambio(evento: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = evento.target;
    setValores({ ...valores, [name]: value }); // copiamos el objeto y cambiamos un campo
    setErrores({ ...errores, [name]: undefined }); // borramos el error del campo que se está corrigiendo
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); // evita que el navegador recargue la página

    const erroresEncontrados = validarFormulario(valores);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) {
      return; // hay errores: no enviamos nada
    }

    const guardadoCorrectamente = await onGuardar(convertirAProductoDatos(valores));
    if (guardadoCorrectamente && !esEdicion) {
      setValores(VALORES_INICIALES); // limpiamos el formulario después de crear
    }
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio} noValidate>
      <h2 className="panel__titulo">{esEdicion ? `Editar ${productoInicial.codigo}` : 'Nuevo producto'}</h2>

      <div className="formulario__fila">
        <div className="campo">
          <label htmlFor="codigo" className="campo__etiqueta">Código *</label>
          <input
            id="codigo"
            name="codigo"
            className={`campo__control ${errores.codigo ? 'campo__control--error' : ''}`}
            placeholder="PAP-010"
            value={valores.codigo}
            onChange={manejarCambio}
          />
          {errores.codigo && <span className="campo__error">{errores.codigo}</span>}
        </div>

        <div className="campo">
          <label htmlFor="categoria" className="campo__etiqueta">Categoría *</label>
          <select
            id="categoria"
            name="categoria"
            className={`campo__control ${errores.categoria ? 'campo__control--error' : ''}`}
            value={valores.categoria}
            onChange={manejarCambio}
          >
            <option value="">Selecciona...</option>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
          {errores.categoria && <span className="campo__error">{errores.categoria}</span>}
        </div>
      </div>

      <div className="campo">
        <label htmlFor="nombre" className="campo__etiqueta">Nombre *</label>
        <input
          id="nombre"
          name="nombre"
          className={`campo__control ${errores.nombre ? 'campo__control--error' : ''}`}
          placeholder="Cuaderno argollado 80 hojas"
          value={valores.nombre}
          onChange={manejarCambio}
        />
        {errores.nombre && <span className="campo__error">{errores.nombre}</span>}
      </div>

      <div className="formulario__fila">
        <div className="campo">
          <label htmlFor="precio" className="campo__etiqueta">Precio (COP) *</label>
          <input
            id="precio"
            name="precio"
            type="number"
            min="0"
            step="any"
            className={`campo__control ${errores.precio ? 'campo__control--error' : ''}`}
            placeholder="5900"
            value={valores.precio}
            onChange={manejarCambio}
          />
          {errores.precio && <span className="campo__error">{errores.precio}</span>}
        </div>

        <div className="campo">
          <label htmlFor="stock" className="campo__etiqueta">Stock *</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            className={`campo__control ${errores.stock ? 'campo__control--error' : ''}`}
            placeholder="10"
            value={valores.stock}
            onChange={manejarCambio}
          />
          {errores.stock && <span className="campo__error">{errores.stock}</span>}
        </div>
      </div>

      <div className="campo">
        <label htmlFor="descripcion" className="campo__etiqueta">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          className={`campo__control ${errores.descripcion ? 'campo__control--error' : ''}`}
          placeholder="Detalles opcionales del producto"
          value={valores.descripcion}
          onChange={manejarCambio}
        />
        <span className="campo__ayuda">{valores.descripcion.length}/300</span>
        {errores.descripcion && <span className="campo__error">{errores.descripcion}</span>}
      </div>

      <div className="formulario__botones">
        <button type="submit" className="boton boton--primario" disabled={guardando}>
          {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Agregar producto'}
        </button>
        {esEdicion && (
          <button type="button" className="boton boton--secundario" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
