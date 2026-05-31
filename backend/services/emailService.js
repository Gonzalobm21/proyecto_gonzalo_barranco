const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// "10:00:00" → "10:00"
function formatHora(hora) {
    return hora.substring(0, 5);
}

// "2025-06-15" → "domingo, 15 de junio de 2025"
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
    const msg = {
        to: emailCliente,
        from: {
            email: process.env.EMAIL_FROM,
            name: process.env.EMAIL_FROM_NAME
        },
        subject: `✂ Confirmación de tu cita — Essenzia Barber Shop`,
        templateId: 'd-e25241faee5f42b397113b42b7bf1293',
        dynamicTemplateData: {
            nombre_cliente: nombreCliente,
            nombre_servicio: nombreServicio,
            precio: precio,
            fecha: formatFecha(fecha),
            hora_inicio: formatHora(horaInicio),
            hora_fin: formatHora(horaFin),
            direccion: process.env.BARBERIA_DIRECCION || 'Sevilla'
        }
    };

    await sgMail.send(msg);
}

module.exports = { enviarConfirmacionCita };
