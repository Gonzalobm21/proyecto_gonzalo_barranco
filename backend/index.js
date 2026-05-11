const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const supabase = require('./supabase');

const authRoutes = require('./routes/auth');
const citasRoutes = require('./routes/citas');

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

// --- CONEXION DE RUTAS CON SUS LÍMITES ESPECÍFICOS ---
app.use('/auth', authLimiter, authRoutes);
app.use('/citas', generalLimiter, citasRoutes);

app.get('/', (req, res) => {
    res.send('API del proyecto');
});

// --- RUTAS DE LA APLICACIÓN ---

app.get('/test-servicios', async (req, res, next) => {
    try {
        const { data, error } = await supabase.from('servicio').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// RUTA: Crear una cita
app.post('/nueva-cita', async (req, res, next) => {
    const { id_servicio, fecha, hora_inicio, id_usuario } = req.body;

    try {
        // 1. Buscar la duración del servicio en la BD
        const { data: servicio, error: errorServicio } = await supabase
            .from('servicio')
            .select('duracion_minutos')
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

        // Si todo ha ido bien
        res.status(201).json({ 
            mensaje: "Cita reservada correctamente", 
            cita: nuevaCita[0] 
        });

    } catch (err) {
        next(err); // Pasamos el error al manejador global
    }
});

// RUTA: Consultar horas ocupadas (Citas confirmadas + Bloqueos de agenda)
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

// RUTA: Obtener las citas de un usuario específico (Para la página Mis Citas)
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

// RUTA: Cancelar una cita
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

// RUTA: Publicar una reseña
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
        // 1. Guardar la reseña en la tabla 'review'
        const { error: insertError } = await supabase
            .from('review')
            .insert([{
                id_usuario,
                id_servicio,
                calificacion,
                comentario
            }]);

        if (insertError) throw insertError;

        // 2. Marcar la cita como reseñada en la tabla 'cita'
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

// RUTA: Obtener todas las reseñas (despues las muestro en el Home)
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
});