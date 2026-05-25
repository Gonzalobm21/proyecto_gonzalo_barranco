const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

function formatearFecha(fechaStr) {
    const [year, month, day] = fechaStr.split('-');
    return `${day}/${month}/${year}`;
}

function formatearHora(horaStr) {
    return horaStr.substring(0, 5);
}

async function enviarConfirmacionCita({ emailCliente, nombreServicio, precio, fecha, horaInicio, horaFin }) {
    const fechaFormateada = formatearFecha(fecha);
    const horaInicioFormateada = formatearHora(horaInicio);
    const horaFinFormateada = formatearHora(horaFin);
    const appUrl = process.env.APP_URL || 'https://essenzia-barber-shop.onrender.com';
    const direccion = process.env.BARBERIA_DIRECCION || 'Dirección de la barbería';

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.12); }
        .header { background-color: #111111; color: #c9a84c; padding: 32px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 26px; letter-spacing: 3px; text-transform: uppercase; }
        .header p { margin: 6px 0 0; font-size: 13px; color: #aaa; letter-spacing: 1px; }
        .body { padding: 32px 30px; color: #333333; }
        .body h2 { margin-top: 0; color: #111111; font-size: 20px; }
        .body > p { line-height: 1.6; }
        .details { background: #fafafa; border-left: 4px solid #c9a84c; padding: 16px 20px; margin: 24px 0; border-radius: 0 6px 6px 0; }
        .details p { margin: 8px 0; font-size: 15px; line-height: 1.5; }
        .details strong { color: #111111; min-width: 90px; display: inline-block; }
        .link-section { margin-top: 24px; line-height: 1.7; }
        .link-section a { color: #c9a84c; font-weight: bold; }
        .footer { padding: 20px 30px; border-top: 1px solid #eeeeee; font-size: 12px; color: #aaaaaa; text-align: center; }
        .footer a { color: #aaaaaa; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>Essenzia Barber Shop</h1>
            <p>Confirmación de reserva</p>
        </div>
        <div class="body">
            <h2>Tu reserva ha sido confirmada.</h2>
            <p>Gracias por elegirnos. A continuación encontrarás los detalles de tu cita:</p>
            <div class="details">
                <p><strong>Servicio:</strong> ${nombreServicio}</p>
                <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                <p><strong>Hora:</strong> ${horaInicioFormateada} – ${horaFinFormateada}</p>
                <p><strong>Precio:</strong> ${precio} €</p>
                <p><strong>Dirección:</strong> ${direccion}</p>
            </div>
            <div class="link-section">
                <p>Para modificar o cancelar una reserva, inicia sesión: <a href="${appUrl}">${appUrl}</a> y selecciona el marcador <strong>"Mis Citas"</strong>.</p>
            </div>
        </div>
        <div class="footer">
            <p><a href="mailto:${process.env.GMAIL_USER}?subject=Baja%20notificaciones">Haz click aquí si deseas darte de baja de esta lista.</a></p>
        </div>
    </div>
</body>
</html>
    `.trim();

    await transporter.sendMail({
        from: `"Essenzia Barber Shop" <${process.env.GMAIL_USER}>`,
        to: emailCliente,
        subject: 'Confirmación de tu cita – Essenzia Barber Shop',
        html
    });
}

module.exports = { enviarConfirmacionCita };
