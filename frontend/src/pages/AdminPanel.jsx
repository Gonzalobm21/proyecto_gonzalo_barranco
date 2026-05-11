import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router-dom';

function AdminPanel() {
  const [clientes, setClientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState(''); // Para el texto del buscador
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); // Para saber a quién hemos clicado
  const [historialCitas, setHistorialCitas] = useState([]); // Para guardar las citas del cliente clicado
  const [cargandoHistorial, setCargandoHistorial] = useState(false); // Para el loading del historial
  
  // Estados para bloqueos de agenda
  const [fechaBloqueo, setFechaBloqueo] = useState('');
  const [horaInicioBloqueo, setHoraInicioBloqueo] = useState('');
  const [horaFinBloqueo, setHoraFinBloqueo] = useState('');
  const [motivoBloqueo, setMotivoBloqueo] = useState('');
  const [cargandoBloqueo, setCargandoBloqueo] = useState(false);
  
  // Lógica del calendarrio
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const [modalCalendarioAbierto, setModalCalendarioAbierto] = useState(false);
  const [filtroFecha, setFiltroFecha] = useState(null);
  const [mesVisible, setMesVisible] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1));

  const anioActual = mesVisible.getFullYear();
  const mesActual = mesVisible.getMonth();
  const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();
  const primerDiaSemana = new Date(anioActual, mesActual, 1).getDay();
  const espaciosVacios = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;
  const mesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const cambiarMes = (incremento) => setMesVisible(new Date(anioActual, mesActual + incremento, 1));
  const formatearFecha = (d, m, a) => `${a}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const citasFiltradas = filtroFecha 
    ? citas.filter(cita => cita.fecha === filtroFecha) 
    : citas;


  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);

        // Clientes: SOLO los que tengan rol 'cliente'
        const { data: dataClientes, error: errClientes } = await supabase
          .from('usuario')
          .select('*')
          .eq('rol', 'cliente'); 
          
        if (errClientes) throw errClientes;
        setClientes(dataClientes || []);

        // Citas: SOLO las que tengan estado 'CONFIRMADA' con usuario y servicio
        const { data: dataCitas, error: errCitas } = await supabase
          .from('cita')
          .select(`
            id_cita,
            fecha,
            hora_inicio,
            estado,
            usuario!inner (
              nombre,
              rol
            ),
            servicio (
              nombre,
              precio,
              duracion_minutos
            )
          `)
          .eq('estado', 'CONFIRMADA')
          .eq('usuario.rol', 'cliente')
          .order('fecha', { ascending: true });
          
        if (errCitas) throw errCitas;
        setCitas(dataCitas || []);

      } catch (error) {
        console.error("Error cargando panel:", error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Lógica del buscador 
  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Función que se ejecuta al hacer clic en un cliente
  const verDetallesCliente = async (cliente) => {
    setClienteSeleccionado(cliente);
    setCargandoHistorial(true);
    
    try {
      const { data, error } = await supabase
        .from('cita')
        .select(`
          id_cita,
          fecha,
          hora_inicio,
          estado,
          servicio ( nombre, precio, duracion_minutos ) 
        `)
        .eq('id_usuario', cliente.id_usuario)
        .order('fecha', { ascending: false });

      if (error) throw error;
      setHistorialCitas(data || []);
    } catch (error) {
      console.error("Error al cargar historial:", error.message);
    } finally {
      setCargandoHistorial(false);
    }
  };

  // Función para cerrar la tarjeta del cliente
  const cerrarModal = () => {
    setClienteSeleccionado(null);
    setHistorialCitas([]);
  };

  // Función para guardar un bloqueo de horario
  const manejarBloqueo = async (e) => {
    e.preventDefault();
    setCargandoBloqueo(true);
    
    try {
      const { error } = await supabase
        .from('bloqueo_agenda')
        .insert([{
            fecha: fechaBloqueo,
            hora_inicio: horaInicioBloqueo,
            hora_fin: horaFinBloqueo,
            motivo: motivoBloqueo
        }]);

      if (error) throw error;
      
      alert("¡Horario bloqueado con éxito!");
      
      // Limpiamos el formulario para el siguiente uso
      setFechaBloqueo('');
      setHoraInicioBloqueo('');
      setHoraFinBloqueo('');
      setMotivoBloqueo('');
    } catch (error) {
      console.error("Error al bloquear horario:", error.message);
      alert("Hubo un error al bloquear el horario.");
    } finally {
      setCargandoBloqueo(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7FF] p-8 text-[#070707]">
      {/* Boton de volver */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="text-[#8A2D3B] font-bold uppercase text-sm hover:text-[#070707] transition flex items-center gap-2 w-fit"
        >
          Volver al Inicio
        </Link>
      </div>

      <h1 className="text-4xl font-serif font-bold text-[#8A2D3B] mb-8 uppercase tracking-wider">
        Panel de Administrador
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tarjeta de Proximas Citas */}
        <div className="bg-white p-6 shadow-md border-t-4 border-[#8A2D3B]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Proximas Citas ({citasFiltradas.length})</h2>
            <div className="flex items-center gap-3">
              {filtroFecha && (
                <button 
                  onClick={() => setFiltroFecha(null)} 
                  className="text-xs text-[#8A2D3B] font-bold uppercase hover:underline"
                >
                  Ver todas
                </button>
              )}
              <button 
                onClick={() => setModalCalendarioAbierto(true)} 
                className="text-gray-400 hover:text-[#070707] transition"
                title="Filtrar por dia"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          {cargando ? (
            <p className="text-gray-500 italic">Cargando informacion...</p>
          ) : citasFiltradas.length === 0 ? (
            <p className="text-gray-600">No hay reservas para esta seleccion.</p>
          ) : (
            <div className="max-h-64 overflow-y-auto pr-2">
              <ul className="divide-y divide-gray-200">
                {citasFiltradas.map((cita) => (
                  <li key={cita.id_cita} className="py-3">
                    <div>
                      <p className="font-bold text-[#070707] uppercase text-sm">
                        {cita.usuario?.nombre || 'Cliente desconocido'}
                      </p>
                      <p className="text-[#8A2D3B] font-medium">
                        {cita.fecha} - {cita.hora_inicio}
                      </p>
                      <p className="text-xs text-gray-500">Estado: {cita.estado}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Tarjeta de Gestion de Clientes */}
        <div className="bg-white p-6 shadow-md border-t-4 border-[#070707]">
          <h2 className="text-2xl font-bold mb-4">Clientes Registrados</h2>
          
          <input 
            type="text" 
            placeholder="Buscar cliente por nombre..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-[#8A2D3B]"
          />
          
          <div className="max-h-64 overflow-y-auto pr-2">
            <ul className="divide-y divide-gray-200">
              {clientesFiltrados.map((cliente) => (
                <li key={cliente.id_usuario} className="py-2">
                  <button 
                    onClick={() => verDetallesCliente(cliente)}
                    className="w-full text-left font-bold text-[#070707] hover:text-[#8A2D3B] transition py-1"
                  >
                    {cliente.nombre || 'Sin nombre registrado'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Tarjeta de Bloqueo de Horarios */}
        <div className="bg-white p-6 shadow-md border-t-4 border-gray-400 md:col-span-2">
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-[#070707]">
            Bloquear Horario en Agenda
          </h2>
          <form onSubmit={manejarBloqueo} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-black text-gray-400 mb-1 uppercase tracking-tighter">Fecha</label>
              <input 
                type="date" 
                required 
                value={fechaBloqueo} 
                onChange={(e) => setFechaBloqueo(e.target.value)} 
                className="w-full p-3 border-2 border-gray-100 rounded font-bold focus:border-[#8A2D3B] focus:outline-none transition" 
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-black text-gray-400 mb-1 uppercase tracking-tighter">Inicio</label>
              <input 
                type="time" 
                required 
                value={horaInicioBloqueo} 
                onChange={(e) => setHoraInicioBloqueo(e.target.value)} 
                className="w-full p-3 border-2 border-gray-100 rounded font-bold focus:border-[#8A2D3B] focus:outline-none transition" 
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-black text-gray-400 mb-1 uppercase tracking-tighter">Fin</label>
              <input 
                type="time" 
                required 
                value={horaFinBloqueo} 
                onChange={(e) => setHoraFinBloqueo(e.target.value)} 
                className="w-full p-3 border-2 border-gray-100 rounded font-bold focus:border-[#8A2D3B] focus:outline-none transition" 
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-black text-gray-400 mb-1 uppercase tracking-tighter">Motivo</label>
              <input 
                type="text" 
                placeholder="Ej: Médico, Vacaciones..." 
                value={motivoBloqueo} 
                onChange={(e) => setMotivoBloqueo(e.target.value)} 
                className="w-full p-3 border-2 border-gray-100 rounded font-bold focus:border-[#8A2D3B] focus:outline-none transition" 
              />
            </div>
            <button 
              type="submit" 
              disabled={cargandoBloqueo} 
              className="bg-[#070707] text-white font-black uppercase tracking-widest py-4 px-8 rounded border-2 border-[#070707] hover:bg-[#8A2D3B] hover:border-[#8A2D3B] transition disabled:opacity-50 h-[52px]"
            >
              {cargandoBloqueo ? '...' : 'Bloquear'}
            </button>
          </form>
        </div>
      </div>

      {/* Modal flotante con la ficha del cliente */}
      {clienteSeleccionado && (
        <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-white/10 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] relative">
            
            {/* Cabecera del Modal */}
            <div className="bg-[#8A2D3B] p-5 flex justify-between items-center text-[#F7F7FF]">
              <h3 className="text-xl font-bold uppercase tracking-wide">Ficha del Cliente</h3>
              <button 
                onClick={cerrarModal} 
                className="text-white hover:text-gray-300 font-bold text-3xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Datos Personales */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h4 className="text-3xl font-serif font-bold text-[#070707] mb-2">
                {clienteSeleccionado.nombre}
              </h4>
              <div className="flex flex-col gap-2 text-sm text-gray-700 mt-3">
                <p><strong>Email:</strong> {clienteSeleccionado.email}</p>
                <p><strong>Telefono:</strong> {clienteSeleccionado.telefono || 'No proporcionado'}</p>
              </div>
            </div>

            {/* Historial de Citas */}
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <h5 className="font-bold text-lg mb-4 border-b pb-2">Historial de Citas</h5>
              
              {cargandoHistorial ? (
                <p className="text-gray-500 italic text-center py-4">Cargando historial...</p>
              ) : historialCitas.length === 0 ? (
                <p className="text-gray-600 text-center py-4">Este cliente no tiene reservas.</p>
              ) : (
                <ul className="space-y-3">
                  {historialCitas.map((cita) => (
                    <li key={cita.id_cita} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center shadow-sm">
                      <div>
                        <p className="font-bold text-[#070707]">{cita.fecha} a las {cita.hora_inicio}</p>
                        <p className="text-sm text-gray-600 my-1">
                          Servicio: <span className="font-semibold text-[#8A2D3B]">{cita.servicio?.nombre || 'Desconocido'}</span>
                        </p>
                        <div className="flex gap-2 text-xs mt-2">
                          {cita.servicio?.precio && (
                            <span className="bg-gray-100 text-[#070707] px-2 py-1 rounded font-bold border border-gray-200">
                              {cita.servicio.precio} EUR
                            </span>
                          )}
                          {cita.servicio?.duracion_minutos && (
                            <span className="text-gray-500 px-2 py-1">
                              Duracion: {cita.servicio.duracion_minutos} min
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                        cita.estado === 'CONFIRMADA' ? 'bg-green-100 text-green-700 border border-green-200' : 
                        cita.estado === 'CANCELADA' ? 'bg-red-100 text-red-700 border border-red-200' : 
                        'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {cita.estado}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Modal flotante del Calendario */}
      {modalCalendarioAbierto && (
        <div className="fixed top-0 left-0 w-full h-full backdrop-blur-md bg-white/10 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative">
            
            <div className="bg-[#070707] p-4 flex justify-between items-center text-[#F7F7FF]">
              <h3 className="text-xl font-bold uppercase tracking-wide">Seleccionar Dia</h3>
              <button 
                onClick={() => setModalCalendarioAbierto(false)} 
                className="text-gray-400 hover:text-white font-bold text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => cambiarMes(-1)} className="font-black text-xl hover:text-[#8A2D3B] text-[#070707]">&lt;</button>
                <span className="text-lg font-black uppercase text-[#8A2D3B]">
                  {mesNombres[mesActual]} {anioActual}
                </span>
                <button onClick={() => cambiarMes(1)} className="font-black text-xl hover:text-[#8A2D3B] text-[#070707]">&gt;</button>
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {['L','M','X','J','V','S','D'].map(d => (
                  <div key={d} className="text-[#070707] font-black py-1">{d}</div>
                ))}
                
                {Array.from({ length: espaciosVacios }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                
                {Array.from({ length: diasEnMes }, (_, i) => i + 1).map(dia => {
                  const fechaCasilla = new Date(anioActual, mesActual, dia);
                  fechaCasilla.setHours(0, 0, 0, 0);
                  const fechaStr = formatearFecha(dia, mesActual, anioActual);
                  
                  const esPasado = fechaCasilla < hoy;
                  const esHoy = fechaCasilla.getTime() === hoy.getTime();
                  const estaSeleccionado = filtroFecha === fechaStr;

                  return (
                    <button 
                      key={dia} 
                      disabled={esPasado}
                      onClick={() => {
                        setFiltroFecha(fechaStr);
                        setModalCalendarioAbierto(false);
                      }}
                      className={`aspect-square rounded font-bold transition flex items-center justify-center border-2
                        ${esPasado && !estaSeleccionado ? 'text-gray-400 bg-gray-50 border-gray-100 hover:border-gray-300' : 'text-[#070707] border-transparent hover:border-[#8A2D3B]'}
                        ${esHoy && !estaSeleccionado ? 'border-[#070707]' : ''}
                        ${estaSeleccionado ? 'bg-[#8A2D3B] text-[#F7F7FF] border-[#8A2D3B] shadow-md' : ''}
                      `}
                    >
                      {dia}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;