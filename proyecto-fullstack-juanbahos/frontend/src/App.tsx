import { Encabezado } from './components/Encabezado';
import { InventarioPage } from './pages/InventarioPage';

/** Componente raíz: define la estructura general de la aplicación. */
function App() {
  return (
    <>
      <Encabezado titulo="StockFácil" subtitulo="Gestión de inventario para tu negocio" />
      <InventarioPage />
      <footer className="pie">StockFácil · Proyecto del curso Full Stack (React + Express + MongoDB)</footer>
    </>
  );
}

export default App;
