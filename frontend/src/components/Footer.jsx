import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#170202] text-[#F4F1EA] pt-16 pb-8 border-t-8 border-[#8A2D3B] mt-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-800 pb-12">

        {/* Columna 1: Marca */}
        <div className="flex flex-col">
          <h3 className="font-serif text-3xl font-black tracking-widest mb-2 uppercase">
            Essenzia
            <span className="block text-[#8A2D3B] text-xl mt-1">Barber Shop</span>
          </h3>
          <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs mt-4">
            La esencia de la barbería clásica adaptada a los nuevos tiempos. Cortes de precisión, afeitados a navaja y un trato premium.
          </p>
        </div>

        {/* Columna 2: Horario */}
        <div>
          <h4 className="font-black uppercase tracking-widest text-[#F4F1EA] mb-6 text-sm border-l-4 border-[#8A2D3B] pl-3">
            Horario
          </h4>
          <ul className="text-gray-400 text-sm space-y-3 font-medium">
            <li className="flex justify-between border-b border-gray-800 pb-2">
              <span>Lunes - Viernes</span>
              <span className="text-[#F4F1EA]">09:00 - 14:00 / 17:00 - 20:00 </span>
            </li>
            
            <li className="flex justify-between pb-2">
              <span>Sábados y Domingos</span>
              <span className="text-[#8A2D3B] font-bold uppercase tracking-wider">Cerrado</span>
            </li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div>
          <h4 className="font-black uppercase tracking-widest text-[#F4F1EA] mb-6 text-sm border-l-4 border-[#8A2D3B] pl-3">
            Contacto
          </h4>
          <ul className="text-gray-400 text-sm space-y-5 font-medium">
            <li className="flex items-start gap-3">
              {/* Icono Ubicación */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8A2D3B] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Av. José Saramago, 1<br/>41000 Sevilla</span>
            </li>
            <li className="flex items-center gap-3">
              {/* Icono Teléfono */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8A2D3B] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-bold text-[#F4F1EA] text-lg">+34 955 55 55 55</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Barra de Copyright */}
      <div className="max-w-6xl mx-auto px-6 mt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-medium">
        <p>© {currentYear} Essenzia Barber Shop. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;