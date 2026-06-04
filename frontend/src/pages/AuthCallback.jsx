import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { guardarSesion } from '../services/authService';

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
      const nombreGoogle = user.user_metadata?.full_name || user.user_metadata?.name || user.email;

      const { data: usuarioExistente } = await supabase
        .from('usuario')
        .select('id_usuario, nombre, rol')
        .eq('id_usuario', user.id)
        .single();

      let nombre, rol;

      if (usuarioExistente) {
        nombre = usuarioExistente.nombre;
        rol = usuarioExistente.rol;
      } else {
        await supabase.from('usuario').insert({
          id_usuario: user.id,
          email: user.email,
          nombre: nombreGoogle,
          rol: 'cliente'
        });
        nombre = nombreGoogle;
        rol = 'cliente';
      }

      guardarSesion(session.access_token, { id: user.id, email: user.email, nombre, rol });
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
