import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; 
import foto1 from '../assets/foto1.png';
import foto2 from '../assets/foto2.png';
import foto3 from '../assets/foto3.png';
import foto4 from '../assets/foto4.png';
import foto5 from '../assets/foto5.png';
import foto6 from '../assets/foto6.png';
import foto7 from '../assets/foto7.png';

function Home() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorBackend, setErrorBackend] = useState(false);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  // 1. Array con las 7 imágenes importadas
  const imagenesGaleria = [
    foto1,
    foto2,
    foto3,
    foto4,
    foto5,
    foto6,
    foto7,
  ];

  // 2. Estado para el índice del carrusel
  const [currentIndex, setCurrentIndex] = useState(0);

  // 3. Funciones de navegación
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? imagenesGaleria.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === imagenesGaleria.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

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
    <div className="min-h-screen bg-[#F4F1EA] text-texto-oscuro">
      
      <Navbar />

      <main className="max-w-5xl mx-auto p-8 space-y-24 py-16">
        
        {/* CARRUSEL DE FOTOS */}
      <section className="py-20 bg-[#F4F1EA]">
        <div className="container mx-auto px-4">
          
          <h2 className="text-5xl font-black uppercase text-center mb-12 tracking-tighter italic text-[#070707]">
            La Experiencia
          </h2>

          <div className="max-w-[1000px] mx-auto h-[550px] w-full relative group">
            <div
              style={{ backgroundImage: `url(${imagenesGaleria[currentIndex]})` }}
              className="w-full h-full rounded-xl bg-center bg-cover duration-500 border-4 border-[#070707] shadow-[10px_10px_0px_0px_rgba(7,7,7,1)]"
            ></div>
            <button 
              onClick={prevSlide}
              className="hidden group-hover:flex absolute top-[50%] -translate-y-[-50%] left-4 z-10 items-center justify-center w-12 h-12 bg-white/90 text-[#070707] rounded-full border-2 border-[#070707] shadow-[4px_4px_0px_0px_rgba(7,7,7,1)] hover:bg-[#8A2D3B] hover:text-white transition-all active:translate-y-[-45%] active:shadow-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="hidden group-hover:flex absolute top-[50%] -translate-y-[-50%] right-4 z-10 items-center justify-center w-12 h-12 bg-white/90 text-[#070707] rounded-full border-2 border-[#070707] shadow-[4px_4px_0px_0px_rgba(7,7,7,1)] hover:bg-[#8A2D3B] hover:text-white transition-all active:translate-y-[-45%] active:shadow-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="flex justify-center mt-8 gap-3">
              {imagenesGaleria.map((_, slideIndex) => (
                <button
                  key={slideIndex}
                  onClick={() => setCurrentIndex(slideIndex)}
                  className={`w-3 h-3 rounded-full border-2 border-[#070707] transition-all ${
                    currentIndex === slideIndex ? 'bg-[#8A2D3B] scale-125' : 'bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
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