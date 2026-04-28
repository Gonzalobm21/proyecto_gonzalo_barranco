import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

function Navbar() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Nuevo estado para el modal
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUserAndRole = async (sessionUser) => {
      try {
        setUser(sessionUser);
        if (sessionUser) {
          const { data, error } = await supabase
            .from('usuario')
            .select('rol')
            .eq('id_usuario', sessionUser.id)
            .maybeSingle();
            
          if (!error && data) {
            setUserRole(data.rol);
          } else {
            setUserRole('cliente');
          }
        } else {
          setUserRole(null);
        }
      } catch (err) {
        console.error("Error cargando usuario en Navbar:", err.message);
      }
    };

    supabase.auth.getSession().then(({ data, error }) => {
      if (!error && data?.session) {
        checkUserAndRole(data.session.user);
      } else {
        checkUserAndRole(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkUserAndRole(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Función que se ejecuta al darle a "Aceptar" en el modal
  const confirmarLogout = async () => {
    setShowLogoutModal(false);
    localStorage.removeItem('servicioSeleccionadoId');
    await supabase.auth.signOut();
    navigate('/'); 
  };

  return (
    <header className="bg-[#8A2D3B] p-6 flex justify-between items-center shadow-md relative z-50">
      
      <Link to="/" className="text-[#F7F7FF] text-3xl font-serif font-bold tracking-wider">
        ESSENZIA BARBER SHOP
      </Link>
      
      <nav className="flex gap-4">
        
        {!user ? (
          <Link 
            to="/login" 
            className="bg-[#F7F7FF] text-[#070707] px-5 py-2 rounded font-bold uppercase text-sm border border-[#070707] hover:bg-gray-200 transition"
          >
            Iniciar Sesion
          </Link>
        ) : (
          <button 
            onClick={() => setShowLogoutModal(true)} // Abrimos el modal en lugar de cerrar directo
            className="bg-[#F7F7FF] text-[#070707] px-5 py-2 rounded font-bold uppercase text-sm border border-[#070707] hover:bg-gray-200 transition"
          >
            Cerrar Sesion
          </button>
        )}
        
        {location.pathname !== '/mis-citas' && (
          <Link 
            to="/mis-citas" 
            className="bg-[#F7F7FF] text-[#070707] px-5 py-2 rounded font-bold uppercase text-sm hover:bg-gray-200 transition"
          >
            Mis Citas
          </Link>
        )}

        {userRole === 'admin' && location.pathname !== '/admin' && (
          <Link 
            to="/admin" 
            className="bg-[#F7F7FF] text-[#070707] px-5 py-2 rounded font-bold uppercase text-sm border border-[#070707] hover:bg-gray-200 transition"
          >
            Administrar Citas
          </Link>
        )}
      </nav>

      {/* MODAL DE CERRAR SESIÓN --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 cursor-default">
          <div className="bg-white border-4 border-[#070707] p-8 rounded-xl shadow-[12px_12px_0px_0px_rgba(7,7,7,1)] max-w-sm w-full animate-in fade-in zoom-in duration-200">
            
            <h3 className="text-3xl font-black uppercase text-[#8A2D3B] mb-4 text-center">
              ¿Cerrar Sesión?
            </h3>
            
            <p className="font-bold text-gray-600 mb-8 text-center">
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