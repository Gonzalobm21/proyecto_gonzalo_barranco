import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { guardarSesion } from '../services/authService';
import api from '../services/api';

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const procesarCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        navigate('/login');
        return;
      }

      const user = session.user;

      try {
        const { data } = await api.post(
          '/auth/sync-google-user',
          {
            id: user.id,
            email: user.email,
            nombre: user.user_metadata?.full_name || user.user_metadata?.name || user.email
          },
          {
            headers: { Authorization: `Bearer ${session.access_token}` }
          }
        );

        guardarSesion(session.access_token, {
          id: user.id,
          email: user.email,
          nombre: data.nombre,
          rol: data.rol
        });
      } catch {
        guardarSesion(session.access_token, {
          id: user.id,
          email: user.email,
          nombre: user.user_metadata?.full_name || user.email,
          rol: 'cliente'
        });
      }

      navigate('/');
    };

    procesarCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-fondo-claro flex items-center justify-center">
      <span className="text-[#8A2D3B] font-black text-2xl uppercase tracking-widest animate-pulse">
        INICIANDO SESIÓN...
      </span>
    </div>
  );
}

export default AuthCallback;
