const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

/**
 * @swagger
 * /admin/clientes:
 *   get:
 *     summary: Listar todos los clientes (Admin)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de usuarios con rol cliente
 */
router.get('/clientes', async (_req, res) => {
    const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('rol', 'cliente');

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

/**
 * @swagger
 * /admin/citas:
 *   get:
 *     summary: Listar citas confirmadas con detalle de usuario y servicio (Admin)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de citas confirmadas
 */
router.get('/citas', async (_req, res) => {
    const { data, error } = await supabase
        .from('cita')
        .select('id_cita, fecha, hora_inicio, estado, usuario!inner (nombre, rol), servicio (nombre, precio, duracion_minutos)')
        .eq('estado', 'CONFIRMADA')
        .eq('usuario.rol', 'cliente')
        .order('fecha', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

/**
 * @swagger
 * /admin/historial/{id_usuario}:
 *   get:
 *     summary: Historial de citas de un cliente específico (Admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Historial de citas del cliente
 */
router.get('/historial/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    const { data, error } = await supabase
        .from('cita')
        .select('id_cita, fecha, hora_inicio, estado, servicio (nombre, precio, duracion_minutos)')
        .eq('id_usuario', id_usuario)
        .order('fecha', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Datos para estadísticas del panel de administración (Admin)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Citas no canceladas con usuario y servicio
 */
router.get('/stats', async (_req, res) => {
    const { data, error } = await supabase
        .from('cita')
        .select('fecha, hora_inicio, estado, usuario (nombre), servicio (nombre, precio)')
        .neq('estado', 'CANCELADA');

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

/**
 * @swagger
 * /admin/bloqueos:
 *   get:
 *     summary: Obtener bloqueos de agenda para una fecha (Admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de bloqueos de la fecha
 */
router.get('/bloqueos', async (req, res) => {
    const { fecha } = req.query;
    if (!fecha) return res.status(400).json({ error: "Falta el parámetro fecha" });

    const { data, error } = await supabase
        .from('bloqueo_agenda')
        .select('hora_inicio, hora_fin')
        .eq('fecha', fecha);

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

/**
 * @swagger
 * /admin/bloqueos:
 *   post:
 *     summary: Crear uno o varios bloqueos de agenda (Admin)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bloqueos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     fecha: { type: string, format: date }
 *                     hora_inicio: { type: string }
 *                     hora_fin: { type: string }
 *                     motivo: { type: string }
 *     responses:
 *       201:
 *         description: Bloqueos creados correctamente
 */
router.post('/bloqueos', async (req, res) => {
    const { bloqueos } = req.body;
    if (!bloqueos || bloqueos.length === 0) {
        return res.status(400).json({ error: "No se han proporcionado bloqueos" });
    }

    const { error } = await supabase.from('bloqueo_agenda').insert(bloqueos);
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ mensaje: "Bloqueos creados correctamente" });
});

module.exports = router;
