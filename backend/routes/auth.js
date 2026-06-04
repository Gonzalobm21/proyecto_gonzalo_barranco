// Lógica de usuarios
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea una cuenta en Supabase Auth e inserta el perfil en la tabla `usuario` con rol `cliente`.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan García
 *               telefono:
 *                 type: string
 *                 example: "600123456"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@email.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "mipass123"
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:    { type: string, example: "Usuario registrado con exito" }
 *                 usuarioId:  { type: string, format: uuid }
 *       400:
 *         description: Datos inválidos, email ya registrado o contraseña corta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', async (req, res) => {
    const { email, password, nombre, telefono } = req.body;

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password || !nombre || !regexEmail.test(email)) {
        return res.status(400).json({ error: "Datos invalidos o faltantes" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) return res.status(400).json({ error: authError.message });

    const { error: dbError } = await supabase
        .from('usuario')
        .insert([{ id_usuario: authData.user.id, nombre, telefono, email }]);

    if (dbError) return res.status(400).json({ error: dbError.message });

    res.status(201).json({ mensaje: "Usuario registrado con exito", usuarioId: authData.user.id });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica al usuario con email y contraseña. Devuelve un token JWT que debe usarse como Bearer token en las rutas protegidas.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@email.com
 *               password:
 *                 type: string
 *                 example: "mipass123"
 *     responses:
 *       200:
 *         description: Login exitoso. Devuelve el token de acceso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:  { type: string, example: "Login exitoso" }
 *                 token:    { type: string, description: "JWT de sesión para usar como Bearer token" }
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(401).json({ error: "Credenciales invalidas" });

    const { data: usuarioData } = await supabase
        .from('usuario')
        .select('rol')
        .eq('id_usuario', data.user.id)
        .single();

    res.json({
        mensaje: "Login exitoso",
        token: data.session.access_token,
        usuario: {
            id: data.user.id,
            email: data.user.email,
            rol: usuarioData?.rol || 'cliente'
        }
    });
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: Invalida la sesión del usuario en Supabase.
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 */
router.post('/logout', async (_req, res) => {
    await supabase.auth.signOut();
    res.json({ mensaje: "Sesion cerrada correctamente" });
});

const validarSesion = require('../middleware/authMiddleware');

router.post('/sync-google-user', validarSesion, async (req, res) => {
    const { nombre, email } = req.body;
    const userId = req.usuarioLogueado.id;

    const { data: usuarioExistente } = await supabase
        .from('usuario')
        .select('id_usuario, nombre, rol')
        .eq('id_usuario', userId)
        .single();

    if (usuarioExistente) {
        return res.json({ nombre: usuarioExistente.nombre, rol: usuarioExistente.rol });
    }

    const { error } = await supabase.from('usuario').insert({
        id_usuario: userId,
        email,
        nombre: nombre || email,
        rol: 'cliente'
    });

    if (error) return res.status(500).json({ error: error.message });

    res.json({ nombre: nombre || email, rol: 'cliente' });
});

module.exports = router;
