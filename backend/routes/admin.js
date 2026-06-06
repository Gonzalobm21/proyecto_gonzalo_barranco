const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

/**
 * @swagger
 * /admin/clientes:
 *   get:
 *     summary: Listar todos los clientes (Admin)
 *     description: Devuelve todos los usuarios registrados con rol `cliente`. Usado en el panel de administración para consultar y buscar clientes.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de usuarios con rol cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Error al consultar la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Devuelve todas las citas con estado `CONFIRMADA` ordenadas por fecha ascendente, incluyendo el nombre y teléfono del cliente y los datos del servicio. Usado en la pestaña de citas próximas del panel de administración.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de citas confirmadas ordenadas por fecha
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_cita:     { type: string, format: uuid }
 *                   fecha:       { type: string, format: date, example: "2025-06-10" }
 *                   hora_inicio: { type: string, example: "10:00:00" }
 *                   estado:      { type: string, example: "CONFIRMADA" }
 *                   usuario:
 *                     type: object
 *                     properties:
 *                       nombre:   { type: string, example: "Juan García" }
 *                       rol:      { type: string, example: "cliente" }
 *                   servicio:
 *                     type: object
 *                     properties:
 *                       nombre:            { type: string, example: "Corte + Barba" }
 *                       precio:            { type: number, example: 22.00 }
 *                       duracion_minutos:  { type: integer, example: 60 }
 *       400:
 *         description: Error al consultar la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Devuelve todas las citas de un cliente ordenadas por fecha descendente, con el nombre, precio y duración del servicio. Usado en la pestaña de clientes del panel de administración.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del cliente
 *         example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     responses:
 *       200:
 *         description: Historial de citas del cliente ordenado por fecha descendente
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
 *                   estado:      { type: string, enum: [CONFIRMADA, COMPLETADA, CANCELADA] }
 *                   servicio:
 *                     type: object
 *                     properties:
 *                       nombre:           { type: string, example: "Corte + Barba" }
 *                       precio:           { type: number, example: 22.00 }
 *                       duracion_minutos: { type: integer, example: 60 }
 *       400:
 *         description: Error al consultar la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Devuelve todas las citas que no están canceladas, con la fecha, hora, estado, nombre del cliente y datos del servicio. El frontend usa estos datos para generar los gráficos de la pestaña de estadísticas.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de citas no canceladas con datos de usuario y servicio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fecha:       { type: string, format: date, example: "2025-05-28" }
 *                   hora_inicio: { type: string, example: "10:00:00" }
 *                   estado:      { type: string, enum: [CONFIRMADA, COMPLETADA] }
 *                   usuario:
 *                     type: object
 *                     properties:
 *                       nombre: { type: string, example: "Juan García" }
 *                   servicio:
 *                     type: object
 *                     properties:
 *                       nombre: { type: string, example: "Corte + Barba" }
 *                       precio: { type: number, example: 22.00 }
 *       400:
 *         description: Error al consultar la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Devuelve las franjas horarias bloqueadas de un día concreto. Usado en el calendario del panel de administración para mostrar qué horas están cerradas.
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha a consultar (YYYY-MM-DD)
 *         example: "2025-08-15"
 *     responses:
 *       200:
 *         description: Lista de franjas bloqueadas para la fecha indicada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HoraOcupada'
 *             example:
 *               - hora_inicio: "09:00:00"
 *                 hora_fin: "10:00:00"
 *       400:
 *         description: Falta el parámetro fecha o error en la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: |
 *       Inserta uno o varios bloqueos en la tabla `bloqueo_agenda`. Para bloquear un día completo
 *       se usa hora_inicio `00:00` y hora_fin `23:59`. Para bloquear una franja concreta se usan
 *       los horarios específicos.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bloqueos]
 *             properties:
 *               bloqueos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [fecha, hora_inicio, hora_fin]
 *                   properties:
 *                     fecha:       { type: string, format: date, example: "2025-08-15" }
 *                     hora_inicio: { type: string, example: "00:00" }
 *                     hora_fin:    { type: string, example: "23:59" }
 *                     motivo:      { type: string, example: "Vacaciones" }
 *     responses:
 *       201:
 *         description: Bloqueos creados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje: { type: string, example: "Bloqueos creados correctamente" }
 *       400:
 *         description: No se han proporcionado bloqueos o error en la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
