import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Register() {
  const navigate = useNavigate();
  
  // Estado para guardar lo que escribe el usuario
  const [formData, setFormData] = useState({
  nombre: '',
  telefono: '',
  email: '',
  password: '',
  confirmPassword: '' 
});

  // Estados para gestionar la interfaz
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Función para manejar los cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función principal que se ejecuta al darle a "Crear Cuenta"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return; // Detenemos el proceso aquí mismo
    }

    setLoading(true);

    try {
      // 1. Registrar al usuario en el sistema de Autenticación de Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.nombre, // Le pasamos el nombre y el teléfono para que el Trigger lo pille
            telefono: formData.telefono
            }
        }
      });

      if (signUpError) throw signUpError;

      // 2. Si el registro va bien, actualizamos el teléfono en nuestra tabla pública
      // El Trigger ya ha creado la fila con el nombre y el email
      if (data?.user) {
        const { error: updateError } = await supabase
          .from('usuario')
          .update({ telefono: formData.telefono })
          .eq('id_usuario', data.user.id);

        if (updateError) throw updateError;
      }

      // 3. Si está todo perfecto -> Lo mandamos al inicio de sesión
      navigate('/login', { 
        state: { mensaje: "¡Cuenta creada con éxito! Ya puedes iniciar sesión." } 
      });

    } catch (err) {
      console.error("Error en el registro:", err);
      // Personalizamos los mensajes de error más comunes de Supabase
      if (err.message.includes('already registered')) {
        setError("Este email ya está registrado.");
      } else if (err.message.includes('Password should be at least')) {
        setError("La contraseña debe tener al menos 8 caracteres.");
      } else {
        setError(err.message || "Error al crear la cuenta. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-fondo-claro text-texto-oscuro">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4">
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