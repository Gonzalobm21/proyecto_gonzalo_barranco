import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-texto-oscuro text-fondo-claro py-12 px-8 border-t-8 border-[#8A2D3B] mt-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Columna 1: Marca */}
        <div>
          <h3 className="font-serif text-2xl font-black tracking-widest mb-4">
            ESSENZIA BARBER SHOP
          </h3>
          <p className="text-gray-400 text-sm font-sans">
            La esencia de la barbería clásica adaptada a los nuevos tiempos. Profesionales dedicados a tu imagen.
          </p>
        </div>

        {/* Columna 2: Contacto */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-barber-azul mb-4 font-sans">
            Contacto
          </h4>
          <ul className="text-gray-400 text-sm space-y-2 font-sans">
            <li>Av. José Saramago, 1</li>
            <li>41000 Sevilla</li>
            <li className="font-bold text-fondo-claro pt-2 text-base">
              +34 955 55 55 55
            </li>
          </ul>
        </div>

        {/* Columna 3: Legal */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-barber-rojo mb-4 font-sans">
            Legal
          </h4>
          <ul className="text-gray-400 text-sm space-y-2 font-sans">
            <li>
              <Link to="#" className="hover:text-white transition">Aviso Legal</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white transition">Política de Privacidad</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white transition">Política de Cookies</Link>
            </li>
          </ul>
        </div>
        
      </div>

      {/* Derechos de autor */}
      <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-xs text-white-500 font-sans uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Essenzia Barber Shop. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;