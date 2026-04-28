import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; 

function Home() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorBackend, setErrorBackend] = useState(false);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const response = await api.get('/test-servicios');
        setServicios(response.data);
      } catch (error) {
        console.error("Error al traer servicios:", error);
        setErrorBackend(true);
      } finally {
        setLoading(false);
      }
    };
    cargarServicios();
  }, []);

  useEffect(() => {
    const cargarReviews = async () => {
      try {
        const response = await api.get('/reviews');
        // Guardamos solo las 4 más recientes para no saturar la página principal
        setReviews(response.data.slice(0, 4)); 
      } catch (error) {
        console.error("Error al cargar las reseñas:", error);
      }
    };

    cargarReviews();
  }, []);

  const renderEstrellas = (calificacion) => {
    return "★".repeat(calificacion) + "☆".repeat(5 - calificacion);
  };

  const formatearFecha = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES'); 
  };

  const handleReservar = (id_servicio) => {
    localStorage.setItem('servicioSeleccionadoId', id_servicio);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-patron text-texto-oscuro">
      
      {/* Usamos el nuevo componente Navbar */}
      <Navbar />

      <main className="max-w-5xl mx-auto p-8 space-y-24 py-16">
        
        <section>
          <h2 className="text-4xl font-black mb-8 text-[#8A2D3B] uppercase tracking-wide">La Experiencia</h2>
          <div className="h-80 bg-gray-200 flex items-center justify-center rounded-xl text-texto-oscuro shadow-inner border-4 border-texto-oscuro">
            [Galeria de imagenes de la barberia]
          </div>
        </section>

        <section>
          <h2 className="text-4xl font-black mb-8 text-[#8A2D3B] uppercase tracking-wide">Servicios</h2>
          
          {loading ? (
            <div className="text-center text-barber-azul font-bold text-xl py-10">Cargando la carta de servicios...</div>
          ) : errorBackend ? (
            <div className="text-center bg-red-100 text-barber-rojo font-bold p-8 rounded-xl border-4 border-barber-rojo">
              El servidor esta apagado. Por favor, enciende el backend.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {servicios.map(servicio => (
                <div key={servicio.id_servicio} className="bg-white border-4 border-texto-oscuro rounded-xl p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(7,7,7,1)] hover:-translate-y-2 transition-transform">
                  <div>
                    <h3 className="text-2xl font-black uppercase text-barber-azul">{servicio.nombre}</h3>
                    <div className="text-texto-oscuro font-bold mb-4 mt-2 bg-gray-100 inline-block px-3 py-1 rounded">{servicio.duracion_minutos} MINUTOS</div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="text-5xl font-black text-texto-oscuro mb-6 text-center">{servicio.precio} €</div>
                    {/* Boton de reservar con esquinas dinámicas */}
                    <button 
                        onClick={() => handleReservar(servicio.id_servicio)}
                        className="w-full bg-[#8A2D3B] text-fondo-claro py-4 font-black text-xl uppercase tracking-widest rounded-3xl hover:rounded-3xl scale-90 transform transition-all duration-300 hover:scale-100"
                    >
                    Reservar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- SECCIÓN DE RESEÑAS --- */}
        {reviews.length > 0 && (
          <section className="bg-white border-t-8 border-texto-oscuro py-16 px-8">
            <div className="max-w-6xl mx-auto">
              
              <h2 className="text-4xl md:text-5xl font-black mb-12 text-center uppercase tracking-wide text-texto-oscuro">
                Lo que dicen <span className="text-[#8A2D3B]">Nuestros Clientes</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reviews.map((review) => (
                  <div 
                    key={review.id_review} 
                    className="bg-fondo-claro border-4 border-texto-oscuro p-6 shadow-[6px_6px_0px_0px_rgba(7,7,7,1)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-2xl text-yellow-500 tracking-widest">
                          {renderEstrellas(review.calificacion)}
                        </div>
                        <span className="text-xs font-bold text-gray-400 mt-1 ml-auto">
                          {formatearFecha(review.fecha_creacion)}
                        </span>
                      </div>
                      
                      <p className="font-bold text-gray-700 italic mb-6">
                        "{review.comentario}"
                      </p>
                    </div>
                    
                    <div className="border-t-2 border-texto-oscuro pt-4">
                      <p className="font-black uppercase text-sm text-texto-oscuro">
                        {review.usuario?.nombre || "Cliente Anónimo"}
                      </p>
                      <p className="text-xs font-bold text-[#8A2D3B] uppercase mt-1">
                        Servicio: {review.servicio?.nombre}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Home;