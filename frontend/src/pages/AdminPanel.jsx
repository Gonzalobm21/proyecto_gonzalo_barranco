import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router-dom';

function AdminPanel() {
  const [clientes, setClientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState(''); 
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); 
  const [historialCitas, setHistorialCitas] = useState([]); 
  const [cargandoHistorial, setCargandoHistorial] = useState(false); 
  
  // Estados para bloqueos de agenda
  const [modoBloqueo, setModoBloqueo] = useState('horas'); // 'horas' o 'dias'
  const [diasSeleccionados, setDiasSeleccionados] = useState([]); 
  const [motivoBloqueo, setMotivoBloqueo] = useState('');
  const [cargandoBloqueo, setCargandoBloqueo] = useState(false);
  
  // Estados para el Modal de Horas
  const [diaHorasSeleccionado, setDiaHorasSeleccionado] = useState(null); // 'YYYY-MM-DD'
  const [rangoHoras, setRangoHoras] = useState([]); // Guarda 1 o 2 horas clickeadas

  // Lógica del calendario principal
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
        const { data: dataClientes, error: errClientes } = await supabase.from('usuario').select('*').eq('rol', 'cliente'); 
        if (errClientes) throw errClientes;
        setClientes(dataClientes || []);

        const { data: dataCitas, error: errCitas } = await supabase
          .from('cita')
          .select('id_cita, fecha, hora_inicio, estado, usuario!inner (nombre, rol), servicio (nombre, precio, duracion_minutos)')
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

  const clientesFiltrados = clientes.filter(cliente => cliente.nombre?.toLowerCase().includes(busqueda.toLowerCase()));

  const verDetallesCliente = async (cliente) => {
    setClienteSeleccionado(cliente);
    setCargandoHistorial(true);
    try {
      const { data, error } = await supabase
        .from('cita')
        .select('id_cita, fecha, hora_inicio, estado, servicio ( nombre, precio, duracion_minutos )')
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

  const cerrarModal = () => {
    setClienteSeleccionado(null);
    setHistorialCitas([]);
  };

  /* LÓGICA MATEMÁTICA PARA LAS HORAS */
  const generarHoras = () => {
    const horas = [];
    
    // Turno de mañana: de 09:00 a 13:30 (porque la de las 13:30 termina a las 14:00)
    for (let h = 9; h <= 13; h++) {
      horas.push(`${String(h).padStart(2, '0')}:00`);
      horas.push(`${String(h).padStart(2, '0')}:30`);
    }
    
    // Turno de tarde: de 17:00 a 19:30 (porque la de las 19:30 termina a las 20:00)
    for (let h = 17; h <= 19; h++) {
      horas.push(`${String(h).padStart(2, '0')}:00`);
      horas.push(`${String(h).padStart(2, '0')}:30`);
    }
    
    return horas;
  };

  const timeToMins = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const minsToTime = (m) => {
    const h = Math.floor(m / 60);
    const mins = m % 60;
    return `${String(h).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  // Variables para saber qué horas pintamos de rojo y cuáles se envían a la BD
  let horaInicioCalculada = null;
  let horaFinCalculada = null;
  let minsInicio = 0;
  let minsFin = 0;

  if (rangoHoras.length > 0) {
    const t1 = timeToMins(rangoHoras[0]);
    // Si solo hay un click, inicio y fin son el mismo botón
    const t2 = rangoHoras.length === 2 ? timeToMins(rangoHoras[1]) : t1; 
    
    minsInicio = Math.min(t1, t2); // Automáticamente sabe cuál es menor
    minsFin = Math.max(t1, t2);    // Automáticamente sabe cuál es mayor
    
    horaInicioCalculada = minsToTime(minsInicio);
    // Le sumamos 30 minutos al botón final para que englobe la cita entera
    horaFinCalculada = minsToTime(minsFin + 30); 
  }

  const isSelected = (hora) => {
    if (rangoHoras.length === 0) return false;
    const t = timeToMins(hora);
    return t >= minsInicio && t <= minsFin;
  };

  const handleSlotClick = (hora) => {
    if (rangoHoras.length === 2) {
      setRangoHoras([hora]); // Si ya había dos, empezamos de cero con el nuevo click
    } else {
      setRangoHoras([...rangoHoras, hora]);
    }
  };

  /* FUNCIONES DE GUARDADO EN SUPABASE */
  const manejarBloqueoDias = async () => {
    if (diasSeleccionados.length === 0) return;
    setCargandoBloqueo(true);
    try {
      const datos = diasSeleccionados.map(fStr => ({
        fecha: fStr,
        hora_inicio: '00:00',
        hora_fin: '23:59',
        motivo: motivoBloqueo || 'Vacaciones/Cierre'
      }));
      const { error } = await supabase.from('bloqueo_agenda').insert(datos);
      if (error) throw error;
      alert("Días bloqueados con éxito");
      setDiasSeleccionados([]);
      setMotivoBloqueo('');
    } catch (err) {
      alert(err.message);
    } finally {
      setCargandoBloqueo(false);
    }
  };

  const manejarBloqueoHoras = async () => {
    if (rangoHoras.length === 0) return alert("Selecciona al menos una hora.");
    setCargandoBloqueo(true);
    try {
      const { error } = await supabase.from('bloqueo_agenda').insert([{
        fecha: diaHorasSeleccionado,
        hora_inicio: horaInicioCalculada,
        hora_fin: horaFinCalculada,
        motivo: motivoBloqueo || 'Cierre de horas'
      }]);
      if (error) throw error;
      alert("Horario bloqueado con éxito");
      setDiaHorasSeleccionado(null);
      setRangoHoras([]);
      setMotivoBloqueo('');
    } catch (err) {
      alert(err.message);
    } finally {
      setCargandoBloqueo(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7FF] p-8 text-[#070707]">
      <div className="mb-6">
        <Link to="/" className="text-[#8A2D3B] font-bold uppercase text-sm hover:text-[#070707] transition flex items-center gap-2 w-fit">
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
                <button onClick={() => setFiltroFecha(null)} className="text-xs text-[#8A2D3B] font-bold uppercase hover:underline">
                  Ver todas
                </button>
              )}
              <button onClick={() => setModalCalendarioAbierto(true)} className="text-gray-400 hover:text-[#070707] transition">
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
                      <p className="font-bold text-[#070707] uppercase text-sm">{cita.usuario?.nombre || 'Cliente desconocido'}</p>
                      <p className="text-[#8A2D3B] font-medium">{cita.fecha} - {cita.hora_inicio}</p>
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
                  <button onClick={() => verDetallesCliente(cliente)} className="w-full text-left font-bold text-[#070707] hover:text-[#8A2D3B] transition py-1">
                    {cliente.nombre || 'Sin nombre registrado'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tarjeta Unificada de Bloqueo */}
        <div className="bg-white p-6 shadow-md border-t-4 border-gray-400 md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#070707]">Gestión de Cierres</h2>
            
            <div className="flex bg-gray-100 p-1 rounded-lg border-2 border-gray-200">
              <button 
                onClick={() => { setModoBloqueo('horas'); setDiasSeleccionados([]); setMotivoBloqueo(''); }}
                className={`px-4 py-2 rounded-md font-bold text-xs uppercase transition ${modoBloqueo === 'horas' ? 'bg-[#8A2D3B] text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                Horas Sueltas
              </button>
              <button 
                onClick={() => { setModoBloqueo('dias'); setDiaHorasSeleccionado(null); setMotivoBloqueo(''); }}
                className={`px-4 py-2 rounded-md font-bold text-xs uppercase transition ${modoBloqueo === 'dias' ? 'bg-[#8A2D3B] text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                Días / Vacaciones
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* El Calendario (Es el mismo para ambos modos) */}
            <div className="flex-1 bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => cambiarMes(-1)} className="font-black text-xl hover:text-[#8A2D3B]">&lt;</button>
                <span className="text-sm font-black uppercase text-[#8A2D3B]">
                  {mesNombres[mesActual]} {anioActual}
                </span>
                <button onClick={() => cambiarMes(1)} className="font-black text-xl hover:text-[#8A2D3B]">&gt;</button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {['L','M','X','J','V','S','D'].map(d => <span key={d} className="text-[10px] font-black text-gray-400 py-2">{d}</span>)}
                
                {Array.from({ length: espaciosVacios }).map((_, i) => <div key={`empty-${i}`} />)}

                {Array.from({ length: diasEnMes }, (_, i) => {
                  const d = i + 1;
                  const fStr = formatearFecha(d, mesActual, anioActual);
                  const fechaObj = new Date(anioActual, mesActual, d);
                  fechaObj.setHours(0,0,0,0);
                  const esPasado = fechaObj < hoy;
                  const esFinDeSemana = fechaObj.getDay() === 0 || fechaObj.getDay() === 6;
                  
                  // Lógica visual dependiendo del modo
                  const seleccionado = modoBloqueo === 'dias' ? diasSeleccionados.includes(fStr) : false;

                  return (
                    <button 
                      key={d}
                      disabled={esPasado || esFinDeSemana}
                      onClick={() => {
                        if (modoBloqueo === 'dias') {
                          setDiasSeleccionados(prev => prev.includes(fStr) ? prev.filter(dia => dia !== fStr) : [...prev, fStr]);
                        } else {
                          setDiaHorasSeleccionado(fStr);
                          setRangoHoras([]);
                        }
                      }}
                      className={`aspect-square text-sm font-bold rounded-md transition ${
                        (esPasado || esFinDeSemana) ? 'text-gray-200 cursor-not-allowed bg-gray-50/50' :
                        seleccionado ? 'bg-[#8A2D3B] text-white shadow-md' : 
                        'hover:bg-gray-200 text-[#070707] border border-transparent hover:border-gray-300'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panel de Acción (Cambia según el modo) */}
            <div className="w-full md:w-1/3 flex flex-col justify-center bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200">
              {modoBloqueo === 'dias' ? (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-black text-[#070707] uppercase text-sm mb-4">Cierre de días enteros</h3>
                    <label className="block text-xs font-black text-gray-400 mb-1 uppercase">Motivo (Opcional)</label>
                    <input type="text" placeholder="Ej: Vacaciones" value={motivoBloqueo} onChange={(e) => setMotivoBloqueo(e.target.value)} className="w-full p-3 border-2 border-gray-100 rounded font-bold focus:border-[#8A2D3B] focus:outline-none mb-2" />
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{diasSeleccionados.length} días seleccionados</p>
                  </div>
                  <button onClick={manejarBloqueoDias} disabled={diasSeleccionados.length === 0 || cargandoBloqueo} className="bg-[#070707] text-white font-black uppercase tracking-widest py-4 rounded hover:bg-[#8A2D3B] transition disabled:opacity-50 mt-4">
                    Confirmar Cierre
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500 flex flex-col items-center gap-4 py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-bold uppercase text-xs tracking-wider px-4">
                    Haz clic en un día del calendario para abrir el selector de horas.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div> 

      {/* Modal flotante del Cliente */}
      {clienteSeleccionado && (
        <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-black/40 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] relative">
            <div className="bg-[#8A2D3B] p-5 flex justify-between items-center text-[#F7F7FF]">
              <h3 className="text-xl font-bold uppercase tracking-wide">Ficha del Cliente</h3>
              <button onClick={cerrarModal} className="text-white hover:text-gray-300 font-bold text-3xl leading-none">&times;</button>
            </div>
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h4 className="text-3xl font-serif font-bold text-[#070707] mb-2">{clienteSeleccionado.nombre}</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-700 mt-3">
                <p><strong>Email:</strong> {clienteSeleccionado.email}</p>
                <p><strong>Telefono:</strong> {clienteSeleccionado.telefono || 'No proporcionado'}</p>
              </div>
            </div>
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
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${cita.estado === 'CONFIRMADA' ? 'bg-green-100 text-green-700 border border-green-200' : cita.estado === 'CANCELADA' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
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

      {/* Modal flotante del Calendario de Citas (El de filtrar arriba) */}
      {modalCalendarioAbierto && (
        <div className="fixed top-0 left-0 w-full h-full backdrop-blur-md bg-black/40 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative">
            <div className="bg-[#070707] p-4 flex justify-between items-center text-[#F7F7FF]">
              <h3 className="text-xl font-bold uppercase tracking-wide">Seleccionar Dia</h3>
              <button onClick={() => setModalCalendarioAbierto(false)} className="text-gray-400 hover:text-white font-bold text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => cambiarMes(-1)} className="font-black text-xl hover:text-[#8A2D3B] text-[#070707]">&lt;</button>
                <span className="text-lg font-black uppercase text-[#8A2D3B]">{mesNombres[mesActual]} {anioActual}</span>
                <button onClick={() => cambiarMes(1)} className="font-black text-xl hover:text-[#8A2D3B] text-[#070707]">&gt;</button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {['L','M','X','J','V','S','D'].map(d => <div key={d} className="text-[#070707] font-black py-1">{d}</div>)}
                {Array.from({ length: espaciosVacios }).map((_, i) => <div key={`empty-${i}`} className="p-2"></div>)}
                {Array.from({ length: diasEnMes }, (_, i) => i + 1).map(dia => {
                  const fechaCasilla = new Date(anioActual, mesActual, dia);
                  fechaCasilla.setHours(0, 0, 0, 0);
                  const fechaStr = formatearFecha(dia, mesActual, anioActual);
                  const esPasado = fechaCasilla < hoy;
                  const esFinDeSemana = fechaCasilla.getDay() === 0 || fechaCasilla.getDay() === 6;
                  const esHoy = fechaCasilla.getTime() === hoy.getTime();
                  const estaSeleccionado = filtroFecha === fechaStr;

                  return (
                    <button 
                      key={dia} 
                      disabled={esPasado || esFinDeSemana}
                      onClick={() => { setFiltroFecha(fechaStr); setModalCalendarioAbierto(false); }}
                      className={`aspect-square rounded font-bold transition flex items-center justify-center border-2
                        ${(esPasado || esFinDeSemana) && !estaSeleccionado ? 'text-gray-400 bg-gray-50 border-gray-100 hover:border-gray-300' : 'text-[#070707] border-transparent hover:border-[#8A2D3B]'}
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

      {/* MODAL PARA BLOQUEAR HORAS*/}
      {diaHorasSeleccionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white border-4 border-[#8A2D3B] p-6 md:p-8 rounded-xl shadow-[12px_12px_0px_0px_rgba(138,45,59,1)] max-w-2xl w-full flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black uppercase text-[#070707] tracking-tight">Bloquear Horas</h2>
                <p className="text-[#8A2D3B] font-bold mt-1">Para el día: {diaHorasSeleccionado}</p>
                <p className="text-sm text-gray-500 font-medium mt-2 leading-tight max-w-md">
                  Haz clic en una hora de inicio y luego en una hora de fin para seleccionar un rango. Si solo deseas bloquear 30 minutos, haz doble clic en la misma hora.
                </p>
              </div>
              <button onClick={() => { setDiaHorasSeleccionado(null); setRangoHoras([]); }} className="text-gray-400 hover:text-[#8A2D3B] font-black text-3xl transition leading-none">
                &times;
              </button>
            </div>

            {/* Grid de botones de horas */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 overflow-y-auto py-2 pr-2">
              {generarHoras().map(hora => {
                const isSel = isSelected(hora);
                return (
                  <button
                    key={hora}
                    onClick={() => handleSlotClick(hora)}
                    className={`py-3 rounded text-sm font-black transition border-2 ${
                      isSel 
                        ? 'bg-[#8A2D3B] text-white border-[#8A2D3B] shadow-md transform scale-105' 
                        : 'bg-white text-[#070707] border-gray-200 hover:border-[#8A2D3B] hover:text-[#8A2D3B]'
                    }`}
                  >
                    {hora}
                  </button>
                );
              })}
            </div>

            {/* Resumen y Envío */}
            <div className="mt-6 flex flex-col gap-4 border-t-4 border-gray-100 pt-6">
              
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Rango a bloquear</span>
                {rangoHoras.length > 0 ? (
                  <span className="font-bold text-[#8A2D3B] text-lg">{horaInicioCalculada} - {horaFinCalculada}</span>
                ) : (
                  <span className="font-bold text-gray-400 italic text-sm">Ninguno seleccionado</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 mb-1 uppercase tracking-widest">Motivo (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Médico, Reunión..."
                  value={motivoBloqueo}
                  onChange={(e) => setMotivoBloqueo(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded font-bold focus:border-[#8A2D3B] focus:outline-none transition"
                />
              </div>

              <div className="flex gap-4 mt-2">
                <button 
                  onClick={() => { setDiaHorasSeleccionado(null); setRangoHoras([]); }}
                  className="flex-1 bg-gray-200 text-[#070707] font-black uppercase tracking-widest py-4 rounded border-2 border-gray-300 hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button 
                  onClick={manejarBloqueoHoras}
                  disabled={cargandoBloqueo || rangoHoras.length === 0}
                  className="flex-1 bg-[#8A2D3B] text-white font-black uppercase tracking-widest py-4 rounded border-2 border-[#8A2D3B] hover:bg-[#6b222d] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cargandoBloqueo ? 'Guardando...' : 'Confirmar'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminPanel;