const supabase = require('../supabase');

const validarSesion = async (req, res, next) => {
    // 1. Extraemos la cabecera 'Authorization' de la peticion
    const authHeader = req.headers.authorization;

    // 2. Si no existe la cabecera, denegamos el acceso
    if (!authHeader) {
        return res.status(401).json({ error: "No se ha proporcionado un token de autenticacion" });
    }

    // 3. El formato suele ser "Bearer TOKEN". Sacamos solo el TOKEN.
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Formato de token invalido" });
    }

    // 4. Le preguntamos a Supabase: "¿Este token pertenece a un usuario real con sesion activa?"
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ error: "Sesion invalida o expirada" });
    }

    // 5. SI TODO ESTA BIEN:
    // Guardamos los datos del usuario dentro del objeto 'req' 
    // para que la siguiente funcion sepa QUIEN esta haciendo la peticion.
    req.usuarioLogueado = user;

    // 6. 'next()' le dice a Express que puede pasar a la siguiente funcion (la ruta)
    next();
};

module.exports = validarSesion;