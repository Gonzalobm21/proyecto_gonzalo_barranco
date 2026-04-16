// Lógica de las citas y la función de calcular el tiempo
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const validarSesion = require('../middleware/authMiddleware');
// Funcion auxiliar para tiempo
function calcularHoraFin(horaInicio, duracionMinutos) {
    const partes = horaInicio.split(':');
    const horas = parseInt(partes[0], 10);
    const minutos = parseInt(partes[1], 10);
    const fecha = new Date();
    fecha.setHours(horas, minutos + duracionMinutos, 0);
    const horasStr = String(fecha.getHours()).padStart(2, '0');
    const minutosStr = String(fecha.getMinutes()).padStart(2, '0');
    return `${horasStr}:${minutosStr}:00`;
}

// OBTENER TODAS LAS CITAS (Con detalles de cliente y servicio)
router.get('/detalladas', async (req, res) => {
    const { data, error } = await supabase
        .from('cita')
        .select(`
            id_cita, fecha, hora_inicio, hora_fin, estado,
            usuario (nombre, telefono),
            servicio (nombre, precio)
        `);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// CREAR CITA 
router.post('/', validarSesion, async (req, res) => {
    const { fecha, hora_inicio, id_servicio } = req.body;
    const id_usuario = req.usuarioLogueado.id;

    const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!fecha || !hora_inicio || !id_usuario || !id_servicio) return res.status(400).json({ error: "Faltan campos" });
    if (isNaN(Date.parse(fecha))) return res.status(400).json({ error: "Fecha invalida" });
    if (!regexHora.test(hora_inicio)) return res.status(400).json({ error: "Formato hora invalido" });

    const hoy = new Date().toISOString().split('T')[0];
    if (fecha < hoy) return res.status(400).json({ error: "No puedes reservar en el pasado" });

    const [u, s] = await Promise.all([
        supabase.from('usuario').select('id_usuario').eq('id_usuario', id_usuario).single(),
        supabase.from('servicio').select('duracion_minutos').eq('id_servicio', id_servicio).single()
    ]);

    if (!u.data || !s.data) return res.status(404).json({ error: "Usuario o Servicio no encontrado" });

    const hFin = calcularHoraFin(hora_inicio, s.data.duracion_minutos);

    const { data: solapamientos } = await supabase.from('cita').select('*').eq('fecha', fecha)
        .neq('estado', 'CANCELADA').lt('hora_inicio', hFin).gt('hora_fin', hora_inicio);

    if (solapamientos?.length > 0) return res.status(400).json({ error: "Horario ocupado o solapado" });

    const { data, error } = await supabase.from('cita')
        .insert([{ fecha, hora_inicio, hora_fin: hFin, id_usuario, id_servicio, estado: 'CONFIRMADA' }]).select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data[0]);
});

// ACTUALIZAR ESTADO (PATCH)
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { nuevo_estado } = req.body;
    const estadosValidos = ['CONFIRMADA', 'COMPLETADA', 'CANCELADA'];

    if (!estadosValidos.includes(nuevo_estado)) return res.status(400).json({ error: "Estado no valido" });

    const { data, error } = await supabase.from('cita').update({ estado: nuevo_estado }).eq('id_cita', id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
});

module.exports = router;