import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Lógica: Comprobar si hay un usuario logueado al cargar el Navbar
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Lógica: Escuchar si el usuario inicia o cierra sesión en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Lógica: Función para cerrar sesión
  const handleLogout = async () => {
    localStorage.removeItem('servicioSeleccionadoId');
    await supabase.auth.signOut();
    navigate('/'); // Redirige al inicio tras cerrar sesión
  };

  return (
    <header className="bg-[#8A2D3B] p-6 flex justify-between items-center shadow-md">
      
      {/* Logo/Titulo */}
      <Link to="/" className="text-[#F7F7FF] text-3xl font-serif font-bold tracking-wider">
        ESSENZIA BARBER SHOP
      </Link>
      
      {/* Botones de navegacion */}
      <nav className="flex gap-4">
        
        {/* Lógica: Si NO hay usuario, mostramos "Iniciar Sesión". Si lo hay, mostramos "Cerrar Sesión" */}
        {!user ? (
          <Link 
            to="/login" 
            className="bg-[#F7F7FF] text-[#070707] px-5 py-2 rounded font-bold uppercase text-sm border border-[#070707] hover:bg-gray-200 transition"
          >
            Iniciar Sesion
          </Link>
        ) : (
          <button 
            onClick={handleLogout} 
            className="bg-[#F7F7FF] text-[#070707] px-5 py-2 rounded font-bold uppercase text-sm border border-[#070707] hover:bg-gray-200 transition"
          >
            Cerrar Sesion
          </button>
        )}
        
        {/* Botón de Mis Citas (siempre visible, si no está logueado el App.jsx lo mandará al login) */}
        <Link 
          to="/mis-citas" 
          className="bg-[#F7F7FF] text-[#070707] px-5 py-2 rounded font-bold uppercase text-sm hover:bg-gray-200 transition"
        >
          Mis Citas
        </Link>
      </nav>

    </header>
  );
}

export default Navbar;