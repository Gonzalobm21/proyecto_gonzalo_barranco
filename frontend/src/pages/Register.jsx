import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Register() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '' 
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        nombre: formData.nombre,
        telefono: formData.telefono,
        email: formData.email,
        password: formData.password
      });

      navigate('/login', {
        state: { mensaje: "¡Cuenta creada con éxito! Ya puedes iniciar sesión." }
      });

    } catch (err) {
      const mensaje = err.response?.data?.error || '';
      if (mensaje.includes('already registered') || mensaje.includes('ya registrado')) {
        setError("Este email ya está registrado.");
      } else if (mensaje.includes('6 caracteres') || mensaje.includes('Password')) {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError(mensaje || "Error al crear la cuenta. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA] text-texto-oscuro">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-8">
        <div className="bg-white border-4 border-texto-oscuro p-8 max-w-md w-full shadow-[12px_12px_0px_0px_rgba(7,7,7,1)]">
          <h2 className="text-4xl font-black mb-2 text-center uppercase tracking-wide">
            Únete al <span className="text-barber-azul">Club</span>
          </h2>
          <p className="text-center text-gray-500 font-bold uppercase text-xs tracking-widest mb-8">
            Crea tu cuenta para reservar
          </p>

          {error && (
            <div className="bg-red-100 border-l-4 border-[#8A2D3B] text-[#8A2D3B] p-4 mb-6 font-bold text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block font-black uppercase text-xs mb-2">Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border-4 border-texto-oscuro p-3 font-bold focus:ring-0 outline-none focus:border-barber-azul transition-colors"
                placeholder="Ej. Carlos García"
              />
            </div>

            <div>
              <label className="block font-black uppercase text-xs mb-2">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                required
                value={formData.telefono}
                onChange={handleChange}
                className="w-full border-4 border-texto-oscuro p-3 font-bold focus:ring-0 outline-none focus:border-barber-azul transition-colors"
                placeholder="Ej. 600123456"
              />
            </div>

            <div>
              <label className="block font-black uppercase text-xs mb-2">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border-4 border-texto-oscuro p-3 font-bold focus:ring-0 outline-none focus:border-barber-azul transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block font-black uppercase text-xs mb-2">Contraseña</label>
              <input
                type="password"
                name="password"
                required
                minLength="8"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-4 border-texto-oscuro p-3 font-bold focus:ring-0 outline-none focus:border-barber-azul transition-colors"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
            <label className="block font-black uppercase text-xs mb-2">Confirmar Contraseña</label>
            <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border-4 border-texto-oscuro p-3 font-bold focus:ring-0 outline-none focus:border-barber-azul transition-colors"
                placeholder="Repite tu contraseña"
            />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 w-full bg-texto-oscuro text-white font-black uppercase py-4 border-4 border-texto-oscuro hover:bg-barber-azul hover:border-barber-azul transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <p className="mt-6 text-center font-bold text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-barber-azul hover:underline">
              Inicia Sesión aquí
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Register;