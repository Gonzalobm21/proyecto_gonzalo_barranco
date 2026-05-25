const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Essenzia Barber Shop — API',
            version: '1.0.0',
            description:
                'API REST del sistema de gestión de citas de Essenzia Barber Shop. ' +
                'Permite registrar usuarios, gestionar reservas, bloquear agenda y publicar reseñas.',
            contact: {
                name: 'Gonzalo Barranco Martín',
                email: 'barrancomartingonzalo@gmail.com',
            },
        },
        servers: [
            {
                url: 'https://proyecto-gonzalo-barranco.onrender.com',
                description: 'Servidor de producción (Render)',
            },
            {
                url: 'http://localhost:3000',
                description: 'Servidor local de desarrollo',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtenido al hacer login. Formato: Bearer <token>',
                },
            },
            schemas: {
                Usuario: {
                    type: 'object',
                    properties: {
                        id_usuario: { type: 'string', format: 'uuid', example: 'a1b2c3d4-...' },
                        nombre:     { type: 'string', example: 'Juan García' },
                        email:      { type: 'string', format: 'email', example: 'juan@email.com' },
                        telefono:   { type: 'string', example: '600123456' },
                        rol:        { type: 'string', enum: ['cliente', 'admin'], example: 'cliente' },
                    },
                },
                Servicio: {
                    type: 'object',
                    properties: {
                        id_servicio:       { type: 'integer', example: 1 },
                        nombre:            { type: 'string', example: 'Corte + Barba' },
                        precio:            { type: 'number', format: 'float', example: 22.00 },
                        duracion_minutos:  { type: 'integer', example: 60 },
                    },
                },
                Cita: {
                    type: 'object',
                    properties: {
                        id_cita:       { type: 'string', format: 'uuid', example: 'f9e8d7c6-...' },
                        fecha:         { type: 'string', format: 'date', example: '2025-05-28' },
                        hora_inicio:   { type: 'string', example: '10:00:00' },
                        hora_fin:      { type: 'string', example: '11:00:00' },
                        estado:        { type: 'string', enum: ['CONFIRMADA', 'COMPLETADA', 'CANCELADA'] },
                        resena_dejada: { type: 'boolean', example: false },
                        id_usuario:    { type: 'string', format: 'uuid' },
                        id_servicio:   { type: 'integer', example: 2 },
                    },
                },
                Review: {
                    type: 'object',
                    properties: {
                        id_review:      { type: 'string', format: 'uuid' },
                        calificacion:   { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                        comentario:     { type: 'string', example: 'Excelente servicio.' },
                        fecha_creacion: { type: 'string', format: 'date-time' },
                        usuario:        { type: 'object', properties: { nombre: { type: 'string' } } },
                        servicio:       { type: 'object', properties: { nombre: { type: 'string' } } },
                    },
                },
                HoraOcupada: {
                    type: 'object',
                    properties: {
                        hora_inicio: { type: 'string', example: '10:00:00' },
                        hora_fin:    { type: 'string', example: '10:30:00' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Descripción del error' },
                    },
                },
            },
        },
        tags: [
            { name: 'Autenticación', description: 'Registro e inicio de sesión de usuarios' },
            { name: 'Servicios',     description: 'Catálogo de servicios de la barbería' },
            { name: 'Citas',         description: 'Creación, consulta y gestión de reservas' },
            { name: 'Reseñas',       description: 'Publicación y consulta de valoraciones' },
            { name: 'Admin',         description: 'Operaciones exclusivas del administrador' },
        ],
    },
    // Rutas donde swagger-jsdoc buscará los comentarios JSDoc
    apis: ['./index.js', './routes/*.js'],
};

module.exports = swaggerJsdoc(options);
