const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const supabase = require('./supabase');

const authRoutes = require('./routes/auth');
const citasRoutes = require('./routes/citas');
const { enviarConfirmacionCita } = require('./services/emailService');

const app = express();

// 1. FUNDAMENTAL PARA PRODUCCIÓN (Render)
app.set('trust proxy', 1);

// 2. LIMITADOR PARA LOGIN/REGISTRO
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Demasiados intentos. Por seguridad, bloqueado 15 min." }
});

// 3. LIMITADOR PARA EL RESTO DE LA APP
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Aviso: estás haciendo demasiadas peticiones." }
});

app.use(cors());
app.use(express.json());

// --- SWAGGER UI ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Essenzia Barber Shop — API Docs',
    customCss: '.swagger-ui .topbar { background-color: #BB0A21; }',
}));
app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// --- CONEXION DE RUTAS CON SUS LÍMITES ESPECÍFICOS ---
app.use('/auth', authLimiter, authRoutes);
app.use('/citas', generalLimiter, citasRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Estado del servidor
 *     description: Endpoint raíz que confirma que la API está operativa.
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: API operativa
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: API del proyecto
 */
app.get('/', (req, res) => {
    res.send('API del proyecto');
});

// --- RUTAS DE LA APLICACIÓN ---

/**
 * @swagger
 * /test-servicios:
 *   get:
 *     summary: Obtener todos los servicios
 *     description: Devuelve el catálogo completo de servicios de la barbería (nombre, precio, duración). No requiere autenticación.
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de servicios disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servicio'
 *             example:
 *               - id_servicio: 1
 *                 nombre: "Corte de cabello"
 *                 precio: 15.00
 *                 duracion_minutos: 30
 *               - id_servicio: 2
 *                 nombre: "Corte + Barba"
 *                 precio: 22.00
 *                 duracion_minutos: 60
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/test-servicios', async (req, res, next) => {
    try {
        const { data, error } = await supabase.from('servicio').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /nueva-cita:
 *   post:
 *     summary: Crear una nueva cita (flujo principal del cliente)
 *     description: |
 *       Reserva una cita para un usuario. El backend:
 *       1. Obtiene la duración del servicio desde la BD.
 *       2. Calcula la `hora_fin` automáticamente.
 *       3. Comprueba solapamiento con citas CONFIRMADAS del mismo día.
 *       4. Si no hay conflicto, inserta la cita con estado `CONFIRMADA`.
 *     tags: [Citas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_servicio, fecha, hora_inicio, id_usuario]
 *             properties:
 *               id_servicio:
 *                 type: integer
 *                 example: 2
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-28"
 *               hora_inicio:
 *                 type: string
 *                 example: "10:00"
 *                 description: Formato HH:MM (sin segundos)
 *               id_usuario:
 *                 type: string
 *                 format: uuid
 *                 example: "a1b2c3d4-e5f6-..."
 *     responses:
 *       201:
 *         description: Cita reservada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Cita reservada correctamente"
 *                 cita:
 *                   $ref: '#/components/schemas/Cita'
 *       400:
 *         description: El servicio no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Solapamiento — el horario ya está ocupado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "El horario ya está ocupado por otra cita."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/nueva-cita', async (req, res, next) => {
    const { id_servicio, fecha, hora_inicio, id_usuario } = req.body;

    try {
        // 1. Buscar duración, nombre y precio del servicio en la BD
        const { data: servicio, error: errorServicio } = await supabase
            .from('servicio')
            .select('duracion_minutos, nombre, precio')
            .eq('id_servicio', id_servicio)
            .single();

        if (errorServicio || !servicio) {
            return res.status(400).json({ error: "El servicio no existe." });
        }

        // 2. CALCULAR LA HORA DE FIN
        const [horas, minutos] = hora_inicio.split(':').map(Number);
        const totalMinutos = horas * 60 + minutos + servicio.duracion_minutos;
        
        const finHoras = Math.floor(totalMinutos / 60);
        const finMinutos = totalMinutos % 60;
        
        const hora_inicio_db = `${hora_inicio}:00`;
        const hora_fin_db = `${String(finHoras).padStart(2, '0')}:${String(finMinutos).padStart(2, '0')}:00`;

        // 3. COMPROBAR SOLAPAMIENTO (OVERBOOKING)
        const { data: citasDelDia, error: errorCitas } = await supabase
            .from('cita')
            .select('hora_inicio, hora_fin')
            .eq('fecha', fecha)
            .eq('estado', 'CONFIRMADA');

        if (errorCitas) throw errorCitas;

        const haySolapamiento = citasDelDia.some(cita => {
            return (hora_inicio_db < cita.hora_fin) && (hora_fin_db > cita.hora_inicio);
        });

        if (haySolapamiento) {
            return res.status(409).json({ error: "El horario ya está ocupado por otra cita." });
        }

        // 4. GUARDAR LA CITA EN LA BASE DE DATOS
        const { data: nuevaCita, error: errorInsert } = await supabase
            .from('cita')
            .insert([{
                fecha: fecha,
                hora_inicio: hora_inicio_db,
                hora_fin: hora_fin_db,
                estado: 'CONFIRMADA',
                id_usuario: id_usuario,
                id_servicio: id_servicio
            }])
            .select();

        if (errorInsert) throw errorInsert;

        // 5. ENVIAR EMAIL DE CONFIRMACIÓN (sin bloquear la respuesta)
        const { data: usuario, error: errorUsuario } = await supabase
            .from('usuario')
            .select('email, nombre')
            .eq('id_usuario', id_usuario)
            .single();

        console.log('[EMAIL] id_usuario:', id_usuario);
        console.log('[EMAIL] usuario encontrado:', usuario);
        console.log('[EMAIL] error al buscar usuario:', errorUsuario);

        if (usuario?.email) {
            console.log('[EMAIL] Enviando a:', usuario.email);
            enviarConfirmacionCita({
                emailCliente: usuario.email,
                nombreCliente: usuario.nombre,
                fecha,
                horaInicio: hora_inicio_db,
                horaFin: hora_fin_db,
                nombreServicio: servicio.nombre,
                precio: servicio.precio
            }).then(() => console.log('[EMAIL] Enviado correctamente'))
              .catch(err => console.error('[EMAIL] Error SendGrid:', err.response?.body || err.message));
        } else {
            console.log('[EMAIL] No se envía: usuario sin email o no encontrado');
        }

        res.status(201).json({
            mensaje: "Cita reservada correctamente",
            cita: nuevaCita[0]
        });

    } catch (err) {
        next(err); // Pasamos el error al manejador global
    }
});

/**
 * @swagger
 * /citas-ocupadas:
 *   get:
 *     summary: Horas ocupadas para una fecha
 *     description: |
 *       Devuelve los tramos horarios no disponibles para una fecha, combinando
 *       citas CONFIRMADAS y bloqueos de agenda del administrador en una sola lista.
 *       El frontend los trata de forma idéntica para deshabilitar los botones de hora.
 *     tags: [Citas]
 *     parameters:
 *       - in: query
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha a consultar (YYYY-MM-DD)
 *         example: "2025-05-28"
 *     responses:
 *       200:
 *         description: Lista unificada de tramos ocupados (citas + bloqueos)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HoraOcupada'
 *             example:
 *               - hora_inicio: "10:00:00"
 *                 hora_fin: "11:00:00"
 *               - hora_inicio: "12:00:00"
 *                 hora_fin: "12:30:00"
 *       400:
 *         description: Falta el parámetro `fecha`
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/citas-ocupadas', async (req, res, next) => {
    const { fecha } = req.query;

    if (!fecha) {
        return res.status(400).json({ error: "Falta la fecha" });
    }

    try {
        // 1. Buscamos las citas confirmadas de ese día
        const { data: citas, error: errorCitas } = await supabase
            .from('cita')
            .select('hora_inicio, hora_fin')
            .eq('fecha', fecha)
            .eq('estado', 'CONFIRMADA');

        if (errorCitas) throw errorCitas;

        // 2. Buscamos los bloqueos de agenda de ese día
        const { data: bloqueos, error: errorBloqueos } = await supabase
            .from('bloqueo_agenda')
            .select('hora_inicio, hora_fin')
            .eq('fecha', fecha);

        if (errorBloqueos) throw errorBloqueos;

        // 3. Juntamos las citas y los bloqueos en una sola lista
        const horasOcupadas = [...(citas || []), ...(bloqueos || [])];

        // 4. Se lo enviamos al Frontend (el cliente no notará la diferencia)
        res.json(horasOcupadas);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /mis-citas/{id_usuario}:
 *   get:
 *     summary: Historial de citas de un usuario
 *     description: |
 *       Devuelve todas las citas del usuario ordenadas por fecha descendente.
 *       Antes de responder, actualiza automáticamente a `COMPLETADA` todas las
 *       citas `CONFIRMADAS` cuya fecha sea anterior a hoy.
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del usuario
 *         example: "a1b2c3d4-e5f6-..."
 *     responses:
 *       200:
 *         description: Lista de citas del usuario con información del servicio incluida
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_cita:       { type: string, format: uuid }
 *                   fecha:         { type: string, format: date, example: "2025-05-28" }
 *                   hora_inicio:   { type: string, example: "10:00:00" }
 *                   hora_fin:      { type: string, example: "11:00:00" }
 *                   estado:        { type: string, enum: [CONFIRMADA, COMPLETADA, CANCELADA] }
 *                   resena_dejada: { type: boolean, example: false }
 *                   servicio:
 *                     type: object
 *                     properties:
 *                       nombre: { type: string, example: "Corte + Barba" }
 *                       precio: { type: number, example: 22.00 }
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/mis-citas/:id_usuario', async (req, res, next) => {
    const { id_usuario } = req.params;

    try {
        // Antes de buscar, actualizamos a COMPLETADA todas las citas
        // confirmadas cuya fecha sea anterior a hoy.
        const fechaHoy = new Date().toISOString().split('T')[0];
        await supabase
            .from('cita')
            .update({ estado: 'COMPLETADA' })
            .eq('id_usuario', id_usuario)
            .eq('estado', 'CONFIRMADA')
            .lt('fecha', fechaHoy); // lt = less than (menor que)
        
            // Ahora sí, buscamos las citas    
        const { data, error } = await supabase
            .from('cita')
            .select(`
                id_cita,
                fecha,
                hora_inicio,
                hora_fin,
                estado,
                resena_dejada,
                id_servicio,
                servicio (
                    nombre,
                    precio
                )
            `)
            .eq('id_usuario', id_usuario)
            .order('fecha', { ascending: false }); // Así vemos las citas más reccientes primero

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error("Error al buscar citas:", err);
        next(err);
    }
});

/**
 * @swagger
 * /cancelar-cita/{id_cita}:
 *   put:
 *     summary: Cancelar una cita
 *     description: Cambia el estado de la cita indicada a `CANCELADA`. Usado por el cliente desde la página "Mis Citas".
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id_cita
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID de la cita a cancelar
 *         example: "f9e8d7c6-..."
 *     responses:
 *       200:
 *         description: Cita cancelada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Cita cancelada con éxito"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.put('/cancelar-cita/:id_cita', async (req, res, next) => {
    const { id_cita } = req.params;

    try {
        const { error } = await supabase
            .from('cita')
            .update({ estado: 'CANCELADA' })
            .eq('id_cita', id_cita);

        if (error) throw error;
        res.json({ mensaje: "Cita cancelada con éxito" });
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /nueva-review:
 *   post:
 *     summary: Publicar una reseña
 *     description: |
 *       Guarda la valoración (1-5 estrellas + comentario opcional) de un cliente sobre
 *       un servicio completado. Tras insertar la reseña, marca `resena_dejada = true`
 *       en la cita para impedir que se envíe una segunda reseña para la misma cita.
 *     tags: [Reseñas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_usuario, id_servicio, id_cita, calificacion]
 *             properties:
 *               id_usuario:
 *                 type: string
 *                 format: uuid
 *                 example: "a1b2c3d4-..."
 *               id_servicio:
 *                 type: integer
 *                 example: 2
 *               id_cita:
 *                 type: string
 *                 format: uuid
 *                 example: "f9e8d7c6-..."
 *               calificacion:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comentario:
 *                 type: string
 *                 example: "Excelente servicio, muy profesional."
 *     responses:
 *       201:
 *         description: Reseña publicada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "¡Gracias por tu valoración!"
 *       400:
 *         description: Faltan datos obligatorios o calificación fuera de rango (1-5)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Esta cita ya tiene una reseña asociada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Ya has dejado una reseña para esta cita."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/nueva-review', async (req, res, next) => {
    const { id_usuario, id_servicio, id_cita, calificacion, comentario } = req.body;

    // Validaciones
    if (!id_usuario || !id_servicio || !id_cita || !calificacion) {
        return res.status(400).json({ error: "Faltan datos obligatorios para la reseña." });
    }

    if (calificacion < 1 || calificacion > 5) {
        return res.status(400).json({ error: "La calificación debe ser entre 1 y 5 estrellas." });
    }

    try {
        // 1. Comprobar que la cita no ha sido reseñada ya (evita duplicados)
        const { data: citaCheck, error: checkError } = await supabase
            .from('cita')
            .select('resena_dejada')
            .eq('id_cita', id_cita)
            .single();

        if (checkError) throw checkError;

        if (citaCheck.resena_dejada) {
            return res.status(409).json({ error: "Ya has dejado una reseña para esta cita." });
        }

        // 2. Guardar la reseña en la tabla 'review'
        const { error: insertError } = await supabase
            .from('review')
            .insert([{
                id_usuario,
                id_servicio,
                calificacion,
                comentario
            }]);

        if (insertError) throw insertError;

        // 3. Marcar la cita como reseñada en la tabla 'cita'
        const { error: citaError } = await supabase
            .from('cita')
            .update({ resena_dejada: true })
            .eq('id_cita', id_cita);

        if (citaError) throw citaError;

        // 3. Todo ha ido bien
        res.status(201).json({ mensaje: "¡Gracias por tu valoración!" });
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Obtener todas las reseñas publicadas
 *     description: Devuelve todas las reseñas ordenadas por fecha de creación descendente, incluyendo el nombre del cliente y del servicio. Sin autenticación, usado en la página de inicio.
 *     tags: [Reseñas]
 *     responses:
 *       200:
 *         description: Lista de reseñas con datos del cliente y del servicio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/reviews', async (req, res, next) => {
    try {
        // Pedimos la reseña y le decimos a Supabase que salte a la tabla usuario y servicio para traer los nombres
        const { data, error } = await supabase
            .from('review')
            .select(`
                id_review,
                calificacion,
                comentario,
                fecha_creacion,
                usuario ( nombre ),
                servicio ( nombre )
            `)
            .order('fecha_creacion', { ascending: false }); // Las más nuevas primero

        if (error) throw error;
        
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// --- MANEJADOR GLOBAL DE ERRORES ---
app.use((err, req, res, next) => {
    console.error("ALERTA DE ERROR:", err.message);
    res.status(500).json({ error: "Algo ha salido mal en el servidor." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Swagger UI disponible en http://localhost:${PORT}/api-docs`);
});