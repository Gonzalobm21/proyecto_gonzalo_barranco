// Lógica de las citas y la función de calcular el tiempo
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const validarSesion = require('../middleware/authMiddleware');
const { enviarConfirmacionCita } = require('../services/emailService');

// Función auxiliar para tiempo
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

/**
 * @swagger
 * /citas/detalladas:
 *   get:
 *     summary: Obtener todas las citas con detalles (Admin)
 *     description: Devuelve todas las citas registradas en el sistema con información completa del cliente y del servicio. Uso exclusivo del administrador.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista completa de citas con joins de usuario y servicio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_cita:     { type: string, format: uuid }
 *                   fecha:       { type: string, format: date, example: "2025-05-28" }
 *                   hora_inicio: { type: string, example: "10:00:00" }
 *                   hora_fin:    { type: string, example: "11:00:00" }
 *                   estado:      { type: string, enum: [CONFIRMADA, COMPLETADA, CANCELADA] }
 *                   usuario:
 *                     type: object
 *                     properties:
 *                       nombre:   { type: string }
 *                       telefono: { type: string }
 *                   servicio:
 *                     type: object
 *                     properties:
 *                       nombre: { type: string }
 *                       precio: { type: number }
 *       400:
 *         description: Error al consultar la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /citas:
 *   post:
 *     summary: Crear una nueva cita (requiere autenticación)
 *     description: |
 *       Reserva una cita para el usuario autenticado. El backend valida el formato de la hora,
 *       comprueba que la fecha no sea pasada, y verifica que no exista solapamiento con otras
 *       citas confirmadas en el mismo tramo horario.
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fecha, hora_inicio, id_servicio]
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-28"
 *               hora_inicio:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *                 example: "10:00"
 *               id_servicio:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Cita creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cita'
 *       400:
 *         description: Campos inválidos, fecha pasada, o solapamiento detectado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no proporcionado o sesión inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario o servicio no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
        supabase.from('usuario').select('id_usuario, email, nombre').eq('id_usuario', id_usuario).single(),
        supabase.from('servicio').select('duracion_minutos, nombre, precio').eq('id_servicio', id_servicio).single()
    ]);

    if (!u.data || !s.data) return res.status(404).json({ error: "Usuario o Servicio no encontrado" });

    const hFin = calcularHoraFin(hora_inicio, s.data.duracion_minutos);

    const { data: solapamientos } = await supabase.from('cita').select('*').eq('fecha', fecha)
        .neq('estado', 'CANCELADA').lt('hora_inicio', hFin).gt('hora_fin', hora_inicio);

    if (solapamientos?.length > 0) return res.status(400).json({ error: "Horario ocupado o solapado" });

    const { data, error } = await supabase.from('cita')
        .insert([{ fecha, hora_inicio, hora_fin: hFin, id_usuario, id_servicio, estado: 'CONFIRMADA' }]).select();

    if (error) return res.status(400).json({ error: error.message });

    enviarConfirmacionCita({
        emailCliente: u.data.email,
        nombreServicio: s.data.nombre,
        precio: s.data.precio,
        fecha,
        horaInicio: hora_inicio,
        horaFin: hFin
    }).catch(err => console.error('Error al enviar email de confirmación:', err.message));

    res.status(201).json(data[0]);
});

/**
 * @swagger
 * /citas/{id}:
 *   patch:
 *     summary: Actualizar el estado de una cita
 *     description: Cambia el estado de una cita a CONFIRMADA, COMPLETADA o CANCELADA. Usado principalmente por el administrador para marcar citas como completadas.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID de la cita a actualizar
 *         example: "f9e8d7c6-..."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nuevo_estado]
 *             properties:
 *               nuevo_estado:
 *                 type: string
 *                 enum: [CONFIRMADA, COMPLETADA, CANCELADA]
 *                 example: COMPLETADA
 *     responses:
 *       200:
 *         description: Cita actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cita'
 *       400:
 *         description: Estado no válido o error de base de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
