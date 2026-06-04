import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { guardarSesion } from '../services/authService';
import { supabase } from '../lib/supabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const mensajeExito = location.state?.mensaje;

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) setError('Error al iniciar sesión con Google. Inténtalo de nuevo.');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      guardarSesion(data.token, data.usuario);
      navigate('/');
    } catch {
      setError('Credenciales no válidas. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F1EA] px-4 py-12 relative">
      
      {/* Botón para volver al Inicio */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12">
        <Link to="/" className="font-bold text-barber-azul hover:text-texto-oscuro transition flex items-center gap-2 uppercase tracking-widest text-sm">
          &lt; Volver al inicio
        </Link>
      </div>

      <div className="max-w-md w-full bg-white rounded-xl overflow-hidden border-4 border-texto-oscuro shadow-[8px_8px_0px_0px_rgba(7,7,7,1)]">
        
        {/* Cabecera del Login con el nuevo color rojo/burdeos */}
        <div className="bg-[#8A2D3B] py-10 text-center border-b-4 border-texto-oscuro">
          <div className="font-serif text-3xl font-black text-fondo-claro tracking-widest mb-2">
            ESSENZIA
          </div>
          <p className="text-fondo-claro/80 text-xs font-bold uppercase tracking-[0.3em]">
            Barber Shop
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-black text-texto-oscuro text-center mb-8 uppercase tracking-wide">
            Acceso
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {mensajeExito && (
              <div className="bg-green-50 text-green-800 p-4 rounded font-bold border-2 border-green-800 text-sm text-center">
                {mensajeExito}
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 text-[#8A2D3B] p-4 rounded font-bold border-2 border-[#8A2D3B] text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-black uppercase tracking-widest text-texto-oscuro mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                className="w-full border-2 border-texto-oscuro rounded p-3 bg-fondo-claro focus:border-barber-azul outline-none transition font-bold text-texto-oscuro"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase tracking-widest text-texto-oscuro mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                className="w-full border-2 border-texto-oscuro rounded p-3 bg-fondo-claro focus:border-barber-azul outline-none transition font-bold text-texto-oscuro"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8A2D3B] text-fondo-claro font-black uppercase tracking-widest text-base sm:text-lg py-3 sm:py-4 mt-6 rounded-none hover:rounded-3xl transition-all duration-300 disabled:opacity-50 disabled:hover:rounded-none"
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">o</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full mt-4 flex items-center justify-center gap-3 border-2 border-texto-oscuro bg-white text-texto-oscuro font-black uppercase tracking-widest text-sm py-3 rounded hover:bg-fondo-claro transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <p className="mt-8 text-center text-sm font-bold text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-barber-azul font-black uppercase tracking-widest hover:text-texto-oscuro transition">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;