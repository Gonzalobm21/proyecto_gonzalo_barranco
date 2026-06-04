import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { obtenerSesion, cerrarSesion } from '../services/authService';

function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const cargarUsuario = () => {
      const sesion = obtenerSesion();
      setUsuario(sesion?.usuario || null);
    };

    cargarUsuario();
    window.addEventListener('essenzia_auth_change', cargarUsuario);
    return () => window.removeEventListener('essenzia_auth_change', cargarUsuario);
  }, []);

  const confirmarLogout = async () => {
    setShowLogoutModal(false);
    localStorage.removeItem('servicioSeleccionadoId');
    try {
      await api.post('/auth/logout');
    } catch {
      // Aunque falle el backend, cerramos la sesión local
    }
    cerrarSesion();
    navigate('/');
  };

  return (
    <header className="bg-[#8A2D3B] px-4 py-3 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-2 shadow-md relative z-50">

      <Link to="/" className="text-[#F7F7FF] text-xl sm:text-3xl font-serif font-bold tracking-normal sm:tracking-wider">
        ESSENZIA BARBER SHOP
      </Link>

      <nav className="flex flex-wrap justify-center gap-2 sm:gap-4">

        {!usuario ? (
          <Link
            to="/login"
            className="bg-[#F7F7FF] text-[#070707] px-3 py-1.5 sm:px-5 sm:py-2 rounded font-bold uppercase text-xs sm:text-sm border border-[#070707] hover:bg-gray-200 transition"
          >
            Iniciar Sesion
          </Link>
        ) : (
          <button
            onClick={() => setShowLogoutModal(true)}
            className="bg-[#F7F7FF] text-[#070707] px-3 py-1.5 sm:px-5 sm:py-2 rounded font-bold uppercase text-xs sm:text-sm border border-[#070707] hover:bg-gray-200 transition"
          >
            Cerrar Sesion
          </button>
        )}

        {location.pathname !== '/mis-citas' && (
          <Link
            to="/mis-citas"
            className="bg-[#F7F7FF] text-[#070707] px-3 py-1.5 sm:px-5 sm:py-2 rounded font-bold uppercase text-xs sm:text-sm hover:bg-gray-200 transition"
          >
            Mis Citas
          </Link>
        )}

        {usuario?.rol === 'admin' && location.pathname !== '/admin' && (
          <Link
            to="/admin"
            className="bg-[#F7F7FF] text-[#070707] px-3 py-1.5 sm:px-5 sm:py-2 rounded font-bold uppercase text-xs sm:text-sm border border-[#070707] hover:bg-gray-200 transition"
          >
            Administrar Citas
          </Link>
        )}
      </nav>

      {/* MODAL DE CERRAR SESIÓN --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 cursor-default">
          <div className="bg-white border-4 border-[#070707] p-6 sm:p-8 rounded-xl shadow-[12px_12px_0px_0px_rgba(7,7,7,1)] max-w-sm w-full animate-in fade-in zoom-in duration-200">

            <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#8A2D3B] mb-4 text-center">
              ¿Cerrar Sesión?
            </h3>

            <p className="font-bold text-gray-600 mb-6 sm:mb-8 text-center text-sm sm:text-base">
              Estás a punto de salir de tu cuenta.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-white border-4 border-[#070707] text-[#070707] font-black uppercase tracking-widest py-3 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarLogout}
                className="flex-1 bg-[#8A2D3B] border-4 border-[#8A2D3B] text-white font-black uppercase tracking-widest py-3 hover:bg-red-900 transition"
              >
                Aceptar
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
