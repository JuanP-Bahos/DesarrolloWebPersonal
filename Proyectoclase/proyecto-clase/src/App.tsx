import { productosIniciales } from './data/productosIniciales';
import { formatearPrecio } from './utils/formato';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

const NOMBRE_SITIO = 'Café Andino';
const DIRECCION = 'Calle 10 # 5-20, Bogotá';
const ANIO_ACTUAL = new Date().getFullYear();

function App() {
  return (
    <>
      <Header
        nombreSitio={NOMBRE_SITIO}
        version="2.0"
        enlaces={[
          { texto: 'Inicio', href: '#inicio' },
          { texto: 'Menú', href: '#menu' },
          { texto: 'Contacto', href: '#contacto' },
        ]}
      />
      <main>
        <section id="inicio" aria-labelledby="titulo-inicio">
          <h2 id="titulo-inicio">El mejor café de la montaña</h2>
          <p>Administra el menú del día: productos, precios y unidades.</p>
        </section>
        <section id="menu" aria-labelledby="titulo-menu">
          <h2 id="titulo-menu">Menú</h2>
          
        </section>
      </main>
      <Footer nombreSitio={NOMBRE_SITIO} direccion={DIRECCION} anio={ANIO_ACTUAL} />
    </>
  );
}

export default App;
