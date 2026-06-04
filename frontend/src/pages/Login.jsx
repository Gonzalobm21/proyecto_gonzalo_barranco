import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { guardarSesion } from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const mensajeExito = location.state?.mensaje;

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

        <div className="p-8">
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
              className="w-full bg-[#8A2D3B] text-fondo-claro font-black uppercase tracking-widest text-lg py-4 mt-6 rounded-none hover:rounded-3xl transition-all duration-300 disabled:opacity-50 disabled:hover:rounded-none"
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>

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