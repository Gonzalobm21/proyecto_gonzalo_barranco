import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { supabase } from '../services/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function MisCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [citaACancelar, setCitaACancelar] = useState(null);
  const navigate = useNavigate();
  const [citaAResenar, setCitaAResenar] = useState(null); 
  const [calificacion, setCalificacion] = useState(5);    
  const [comentario, setComentario] = useState('');      
  const [modalExito, setModalExito] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState(null);
  const [enviandoReview, setEnviandoReview] = useState(false);

  useEffect(() => {
    const cargarCitas = async () => {
      try {
        // Usamos getSession para evitar bloqueos de red al recargar la página
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError || !session) {
          navigate('/login');
          return;
        }

        const response = await api.get(`/mis-citas/${session.user.id}`);
        setCitas(response.data);
      } catch (error) {
        console.error("Error al traer las citas:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarCitas();
  }, [navigate]);

  const getEstiloEstado = (estado) => {
    switch(estado) {
      case 'CONFIRMADA': 
        return 'bg-barber-azul text-fondo-claro border-barber-azul';
      case 'COMPLETADA': 
        return 'bg-texto-oscuro text-fondo-claro border-texto-oscuro';
      case 'CANCELADA': 
        return 'bg-[#8A2D3B] text-fondo-claro border-[#8A2D3B]';
      default: 
        return 'bg-gray-200 text-texto-oscuro border-gray-400';
    }
  };

  const formatearFecha = (fechaStr) => {
    const partes = fechaStr.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const handleCancelar = (id_cita) => {
    setCitaACancelar(id_cita);
  };

  const confirmarCancelacion = async () => {
    try {
      await api.put(`/cancelar-cita/${citaACancelar}`);
      setCitaACancelar(null); 
      
      // Actualizamos el estado de la cita a CANCELADA en el frontend sin recargar la página entera
      setCitas(citasActuales => 
        citasActuales.map(cita => 
          cita.id_cita === citaACancelar 
            ? { ...cita, estado: 'CANCELADA' } 
            : cita
        )
      );
    } catch (error) {
      alert("Hubo un error al cancelar la cita.");
    }
  };
  
  const enviarReview = async () => {
    if (enviandoReview) return;
    setEnviandoReview(true);
    try {

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) return;

      await api.post('/nueva-review', {
        id_usuario: session.user.id,
        id_servicio: citaAResenar.id_servicio,
        id_cita: citaAResenar.id_cita,
        calificacion,
        comentario
      });

      setCitaAResenar(null); 
      setComentario('');      
      setCalificacion(5);    
      setModalExito(true); 

      setCitas(citasActuales => 
        citasActuales.map(cita => 
          cita.id_cita === citaAResenar.id_cita 
            ? { ...cita, resena_dejada: true } 
            : cita
        )
      );

    } catch (error) {
      console.error(error);
      const mensajeBackend = error.response?.data?.error || "Error de conexión al enviar la reseña.";
      setErrorMensaje(mensajeBackend);
    } finally {
      setEnviandoReview(false);
    }
  };

  const handleReservarDeNuevo = (id_servicio) => {
    localStorage.setItem('servicioSeleccionadoId', id_servicio);
    navigate('/dashboard');
  };    

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA] text-texto-oscuro">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full p-8 py-12">
        
        <button 
          onClick={() => navigate('/')} 
          className="mb-8 font-bold text-barber-azul hover:text-texto-oscuro transition flex items-center gap-2 uppercase tracking-widest text-sm"
        >
          &lt; Volver a Servicios
        </button>
        
        <h2 className="text-4xl font-black mb-10 text-texto-oscuro uppercase tracking-wide border-b-8 border-[#8A2D3B] pb-4 inline-block">
          Mi Historial de Citas
        </h2>

        {loading ? (
          <div className="text-center font-bold text-xl py-10 uppercase tracking-widest text-[#8A2D3B]">Cargando tus citas...</div>
        ) : citas.length === 0 ? (
          <div className="bg-white border-4 border-texto-oscuro p-10 rounded-xl text-center shadow-[8px_8px_0px_0px_rgba(7,7,7,1)]">
            <p className="font-bold text-xl text-gray-500 mb-4">Aún no tienes ninguna cita registrada.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-barber-azul text-fondo-claro font-black uppercase tracking-widest px-6 py-3 hover:bg-blue-800 transition"
            >
              Ver Servicios
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {citas.map(cita => (
              <div 
                key={cita.id_cita} 
                className={`bg-white border-4 border-texto-oscuro p-6 rounded-xl shadow-[8px_8px_0px_0px_rgba(7,7,7,1)] flex flex-col justify-between transition-transform hover:-translate-y-1
                  ${cita.estado === 'CANCELADA' ? 'opacity-70 grayscale' : ''}
                `}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[#8A2D3B] font-black text-lg uppercase tracking-widest block mb-1">
                      {formatearFecha(cita.fecha)}
                    </span>
                    <h3 className="text-2xl font-black uppercase">{cita.servicio.nombre}</h3>
                  </div>
                  <div className={`px-3 py-1 border-2 rounded font-black text-xs uppercase tracking-wider ${getEstiloEstado(cita.estado)}`}>
                    {cita.estado}
                  </div>
                </div>

                <div className="flex justify-between items-end mt-4 pt-4 border-t-2 border-gray-100">
                  <div className="font-bold text-barber-azul text-xl bg-gray-100 px-3 py-1 rounded">
                    {cita.hora_inicio.slice(0,5)} - {cita.hora_fin.slice(0,5)}
                  </div>
                  <div className="text-3xl font-black text-texto-oscuro">
                    {cita.servicio.precio} €
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t-2 border-gray-100 flex gap-4">    
                    {cita.estado === 'CONFIRMADA' && (
                    <button 
                        onClick={() => handleCancelar(cita.id_cita)}
                        className="flex-1 border-2 border-[#8A2D3B] text-[#8A2D3B] font-bold uppercase text-xs py-2 hover:bg-red-50 transition"
                    >
                        Cancelar Cita
                    </button>
                    )}
                    
                    {cita.estado === 'COMPLETADA' && !cita.resena_dejada && (
                      <button 
                        onClick={() => setCitaAResenar(cita)}
                        className="flex-1 border-2 border-barber-azul text-barber-azul font-bold uppercase text-xs py-2 hover:bg-blue-50 transition"
                      >
                        Dejar Reseña
                      </button>
                    )}

                    <button 
                    onClick={() => handleReservarDeNuevo(cita.id_servicio)}
                    className="flex-1 bg-texto-oscuro text-fondo-claro font-bold uppercase text-xs py-2 hover:bg-barber-azul transition"
                    >
                    Reservar de Nuevo
                    </button>
                    
                </div>    

              </div>
            ))}
          </div>
        )}

      {/* --- PANEL MODAL DE CANCELACIÓN --- */}
      {citaACancelar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white border-4 border-texto-oscuro p-8 rounded-xl shadow-[12px_12px_0px_0px_rgba(7,7,7,1)] max-w-sm w-full">
            
            <h3 className="text-3xl font-black uppercase text-[#8A2D3B] mb-4 text-center">
              ¿Cancelar Cita?
            </h3>
            
            <p className="font-bold text-gray-600 mb-8 text-center">
              Estás a punto de anular esta reserva. Esta acción no se puede deshacer.
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setCitaACancelar(null)}
                className="flex-1 bg-white border-4 border-texto-oscuro text-texto-oscuro font-black uppercase tracking-widest py-3 hover:bg-gray-100 transition"
              >
                Volver
              </button>
              <button 
                onClick={confirmarCancelacion}
                className="flex-1 bg-[#8A2D3B] border-4 border-[#8A2D3B] text-fondo-claro font-black uppercase tracking-widest py-3 hover:bg-red-900 transition"
              >
                Aceptar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- PANEL MODAL DE ENVIAR UNA RESEÑA --- */}
      {citaAResenar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white border-4 border-texto-oscuro p-8 rounded-xl shadow-[12px_12px_0px_0px_rgba(7,7,7,1)] max-w-lg w-full">
            
            <h3 className="text-2xl font-black uppercase text-texto-oscuro mb-2">
              Valorar {citaAResenar.servicio.nombre}
            </h3>
            <p className="text-gray-500 text-sm mb-6 font-bold uppercase tracking-widest">
              Tu opinión nos ayuda a mejorar
            </p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setCalificacion(num)}
                  className={`text-4xl transition-transform hover:scale-110 ${
                    num <= calificacion ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full border-4 border-texto-oscuro rounded-lg p-4 font-bold text-texto-oscuro focus:ring-0 outline-none mb-6 min-h-[120px]"
              placeholder="Escribe aquí tu experiencia..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            
            <div className="flex gap-4">
              <button 
                onClick={() => setCitaAResenar(null)}
                className="flex-1 font-black uppercase text-sm py-3 border-4 border-texto-oscuro hover:bg-gray-100 transition"
              >
                Cerrar
              </button>
              <button
                onClick={enviarReview}
                disabled={enviandoReview}
                className="flex-1 bg-barber-azul text-white font-black uppercase text-sm py-3 border-4 border-barber-azul hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enviandoReview ? 'Enviando...' : 'Enviar Reseña'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PANEL MODAL DE ÉXITO --- */}
        {modalExito && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white border-4 border-texto-oscuro p-8 rounded-xl shadow-[12px_12px_0px_0px_rgba(7,7,7,1)] max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-texto-oscuro">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black uppercase text-texto-oscuro mb-4">
                ¡Reseña Enviada!
              </h3>
              <p className="font-bold text-gray-600 mb-8">
                Gracias por tu comentario. Nos ayuda a seguir mejorando nuestro servicio.
              </p>
              <button 
                onClick={() => setModalExito(false)}
                className="w-full bg-texto-oscuro text-fondo-claro font-black uppercase tracking-widest py-3 hover:bg-gray-800 transition border-4 border-texto-oscuro"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}

        {/* --- PANEL MODAL DE ERROR --- */}
        {errorMensaje && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white border-4 border-[#8A2D3B] p-8 rounded-xl shadow-[12px_12px_0px_0px_rgba(138,45,59,1)] max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#8A2D3B]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8A2D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black uppercase text-[#8A2D3B] mb-4">
                Algo salió mal
              </h3>
              <p className="font-bold text-gray-600 mb-8">
                {errorMensaje}
              </p>
              <button 
                onClick={() => setErrorMensaje(null)}
                className="w-full bg-[#8A2D3B] text-fondo-claro font-black uppercase tracking-widest py-3 hover:bg-red-900 transition border-4 border-[#8A2D3B]"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default MisCitas;