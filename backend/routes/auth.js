// Lógica de usuarios
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Registro de usuario
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

// Login de usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) return res.status(401).json({ error: "Credenciales invalidas" });

    res.json({
        mensaje: "Login exitoso",
        token: data.session.access_token,
        usuario: data.user
    });
});

module.exports = router;