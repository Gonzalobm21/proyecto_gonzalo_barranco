import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { supabase } from '../services/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Dashboard() {
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [hora, setHora] = useState(null);
  const navigate = useNavigate();

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const limiteMaximo = new Date(hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate());
  limiteMaximo.setHours(0, 0, 0, 0);

  const [mesVisible, setMesVisible] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  
  // Estado para guardar las citas que ya están cogidas ese día
  const [horasOcupadas, setHorasOcupadas] = useState([]);

  useEffect(() => {
    const idGuardado = localStorage.getItem('servicioSeleccionadoId');
    if (!idGuardado) {
      navigate('/');
      return;
    }

    const cargarServicioElegido = async () => {
      try {
        const response = await api.get('/test-servicios');
        const servicio = response.data.find(s => String(s.id_servicio) === idGuardado);
        if (servicio) setServicioSeleccionado(servicio);
        else navigate('/');
      } catch (error) {
        console.error("Error:", error);
      }
    };
    cargarServicioElegido();
  }, [navigate]);

  // Cada vez que cambia el día seleccionado, preguntamos al Backend qué horas están pilladas
  useEffect(() => {
    setHora(null); // Reseteamos la hora elegida
    
    if (!fechaSeleccionada) {
      setHorasOcupadas([]);
      return;
    }

    const traerHorasOcupadas = async () => {
      try {
        const response = await api.get(`/citas-ocupadas?fecha=${fechaSeleccionada}`);
        setHorasOcupadas(response.data);
      } catch (error) {
        console.error("Error al consultar disponibilidad:", error);
      }
    };

    traerHorasOcupadas();
  }, [fechaSeleccionada]);

  const anioActual = mesVisible.getFullYear();
  const mesActual = mesVisible.getMonth();
  const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();
  const primerDiaSemana = new Date(anioActual, mesActual, 1).getDay();
  const espaciosVacios = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;
  const mesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const cambiarMes = (incremento) => setMesVisible(new Date(anioActual, mesActual + incremento, 1));
  const formatearFecha = (d, m, a) => `${a}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  
  // Función matemática para saber a qué hora termina el turno que estamos generando
  const calcularHoraFin = (inicio, duracion) => {
    const [horas, minutos] = inicio.split(':').map(Number);
    const totalMinutos = horas * 60 + minutos + duracion;
    const finHoras = Math.floor(totalMinutos / 60);
    const finMinutos = totalMinutos % 60;
    return `${String(finHoras).padStart(2, '0')}:${String(finMinutos).padStart(2, '0')}:00`;
  };

  const obtenerHorasDisponibles = () => {
    if (!servicioSeleccionado || !fechaSeleccionada) return [];
    let horas = [];
    const duracion = servicioSeleccionado.duracion_minutos;

    // 1. Generamos todas las horas
    for (let h = 9; h <= 13; h++) {
      horas.push(`${h < 10 ? '0'+h : h}:00`);
      horas.push(`${h < 10 ? '0'+h : h}:30`);
    }
    for (let h = 17; h <= 19; h++) {
      horas.push(`${h}:00`);
      horas.push(`${h}:30`);
    }

    // 2. Filtro de cierre (no salir más tarde de la hora de cierre)
    if (duracion === 60) horas = horas.filter(h => h !== '13:30' && h !== '19:30');

    // 3. Filtro de horas pasadas (si es hoy)
    const fechaHoyStr = formatearFecha(new Date().getDate(), new Date().getMonth(), new Date().getFullYear());
    if (fechaSeleccionada === fechaHoyStr) {
      const ahora = new Date();
      const tiempoActual = ahora.getHours() * 60 + ahora.getMinutes();
      horas = horas.filter(h => {
        const [horaSlot, minutoSlot] = h.split(':').map(Number);
        return (horaSlot * 60 + minutoSlot) > tiempoActual;
      });
    }

    // 4. Filtro de Overbooking (comparamos con la base de datos)
    horas = horas.filter(h => {
      const inicio_db = `${h}:00`; // Convertimos "10:00" a "10:00:00"
      const fin_db = calcularHoraFin(h, duracion);

      // Comprobamos si este turno choca con alguna cita ya guardada
      const choca = horasOcupadas.some(cita => {
        return (inicio_db < cita.hora_fin) && (fin_db > cita.hora_inicio);
      });

      // Solo conservamos la hora si NO choca con nada
      return !choca;
    });

    return horas;
  };

  const horasDisponibles = obtenerHorasDisponibles();

  const handleReserva = async () => {
    if (!servicioSeleccionado || !fechaSeleccionada || !hora) {
      alert("Por favor, selecciona fecha y hora.");
      return;
    }
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return alert("Inicia sesion de nuevo.");

      const response = await api.post('/nueva-cita', {
        id_servicio: servicioSeleccionado.id_servicio,
        fecha: fechaSeleccionada,
        hora_inicio: hora,
        id_usuario: user.id
      });

      alert(response.data.mensaje + "\nReserva confirmada.");
      navigate('/'); 
    } catch (error) {
      if (error.response?.data?.error) alert("Error: " + error.response.data.error);
    }
  };

  return (
    <div className="min-h-screen bg-patron text-texto-oscuro">
      <Navbar />

      <div className="max-w-4xl mx-auto p-8">
        
        <button 
          onClick={() => navigate('/')} 
          className="mb-6 font-bold text-barber-azul hover:text-texto-oscuro transition flex items-center gap-2 uppercase tracking-widest text-sm"
        >
          &lt; Volver a Servicios
        </button>

        {servicioSeleccionado && (
          <div className="bg-barber-azul text-fondo-claro p-6 rounded-xl mb-10 flex flex-col md:flex-row justify-between items-center shadow-[6px_6px_0px_0px_rgba(7,7,7,1)] border-4 border-texto-oscuro">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest block mb-2 opacity-80">Servicio Elegido</span>
              <span className="text-2xl font-black uppercase">{servicioSeleccionado.nombre}</span>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0">
              <span className="text-4xl font-black block">{servicioSeleccionado.precio} €</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendario */}
          <div className="bg-white border-4 border-texto-oscuro p-6 rounded-xl shadow-[6px_6px_0px_0px_rgba(7,7,7,1)]">
            <div className="flex justify-between items-center mb-6">
              <label className="block text-sm font-black uppercase tracking-widest text-texto-oscuro">Dia</label>
              <div className="flex items-center gap-3">
                <button onClick={() => cambiarMes(-1)} className="font-black text-xl hover:text-barber-azul">&lt;</button>
                <span className="text-lg font-black uppercase min-w-[120px] text-center text-barber-azul">
                  {mesNombres[mesActual]} {anioActual}
                </span>
                <button onClick={() => cambiarMes(1)} className="font-black text-xl hover:text-barber-azul">&gt;</button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {['L','M','X','J','V','S','D'].map(d => <div key={d} className="text-texto-oscuro text-sm font-black py-1">{d}</div>)}
              {Array.from({ length: espaciosVacios }).map((_, i) => <div key={`empty-${i}`} className="p-2"></div>)}
              {Array.from({ length: diasEnMes }, (_, i) => i + 1).map(dia => {
                const fechaCasilla = new Date(anioActual, mesActual, dia);
                fechaCasilla.setHours(0, 0, 0, 0);
                const fechaStr = formatearFecha(dia, mesActual, anioActual);
                const deshabilitado = fechaCasilla.getDay() === 0 || fechaCasilla.getDay() === 6 || fechaCasilla < hoy || fechaCasilla > limiteMaximo;
                const estaSeleccionado = fechaSeleccionada === fechaStr;
                return (
                  <button 
                    key={dia} onClick={() => setFechaSeleccionada(fechaStr)} disabled={deshabilitado}
                    className={`aspect-square rounded font-bold transition flex items-center justify-center border-2
                      ${deshabilitado ? 'text-gray-400 border-gray-100 cursor-not-allowed bg-gray-50' : 'border-transparent hover:border-barber-azul cursor-pointer text-texto-oscuro'} 
                      ${estaSeleccionado ? 'bg-barber-azul text-fondo-claro border-barber-azul shadow-md' : ''}
                      ${fechaCasilla.getDay() === 0 || fechaCasilla.getDay() === 6 ? 'line-through decoration-gray-400' : ''}
                    `}
                  >
                    {dia}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horas */}
          <div className="bg-white border-4 border-texto-oscuro p-6 rounded-xl shadow-[6px_6px_0px_0px_rgba(7,7,7,1)] flex flex-col">
            <label className="block text-sm font-black uppercase tracking-widest text-texto-oscuro mb-6">Hora</label>
            {!fechaSeleccionada ? (
              <div className="text-sm font-bold text-barber-rojo bg-red-50 p-4 rounded border-2 border-barber-rojo flex-1 flex items-center justify-center text-center">
                SELECCIONA UN DIA PRIMERO
              </div>
            ) : horasDisponibles.length === 0 ? (
              <div className="text-sm font-bold text-texto-oscuro bg-gray-100 p-4 rounded border-2 border-gray-300 flex-1 flex items-center justify-center text-center">
                COMPLETO PARA ESTE DIA
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 flex-1 content-start">
                {horasDisponibles.map(h => (
                  <button
                    key={h} onClick={() => setHora(h)}
                    className={`border-2 p-3 rounded font-black text-lg transition
                      ${hora === h ? 'bg-texto-oscuro text-fondo-claro border-texto-oscuro shadow-md' : 'bg-fondo-claro text-texto-oscuro border-texto-oscuro hover:bg-gray-100'}
                    `}
                  >
                    {h}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 pt-6 border-t-4 border-gray-100">
              <button 
                onClick={handleReserva}
                className="w-full bg-[#8A2D3B] text-fondo-claro font-black uppercase tracking-widest text-xl py-4 rounded hover:bg-red-800 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;