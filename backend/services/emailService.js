const axios = require('axios');
const https = require('https');

// Fuerza IPv4 — necesario en Render free tier (no soporta IPv6 saliente)
const ipv4Agent = new https.Agent({ family: 4 });

function formatHora(hora) {
    return hora.substring(0, 5);
}

function formatFecha(fechaStr) {
    const [year, month, day] = fechaStr.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function enviarConfirmacionCita({ emailCliente, nombreCliente, fecha, horaInicio, horaFin, nombreServicio, precio }) {
    const key = process.env.SENDGRID_API_KEY || '';
    console.log(`[EMAIL] API key: longitud=${key.length}, inicio="${key.substring(0, 6)}", fin="${key.substring(key.length - 4)}"`);
    await axios.post(
        'https://api.sendgrid.com/v3/mail/send',
        {
            from: {
                email: process.env.EMAIL_FROM,
                name: process.env.EMAIL_FROM_NAME
            },
            personalizations: [{
                to: [{ email: emailCliente }],
                dynamic_template_data: {
                    nombre_cliente: nombreCliente,
                    nombre_servicio: nombreServicio,
                    precio: precio,
                    fecha: formatFecha(fecha),
                    hora_inicio: formatHora(horaInicio),
                    hora_fin: formatHora(horaFin),
                    direccion: process.env.BARBERIA_DIRECCION || 'Sevilla'
                }
            }],
            template_id: 'd-e25241faee5f42b397113b42b7bf1293',
            subject: '✂ Confirmación de tu cita — Essenzia Barber Shop'
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            },
            httpsAgent: ipv4Agent,
            timeout: 10000
        }
    );
}

module.exports = { enviarConfirmacionCita };
