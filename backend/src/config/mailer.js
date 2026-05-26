import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export async function sendResetEmail(email, nombre, resetLink) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[MAILER] No configurado. Token para ${email}: ${resetLink}`);
    return { simulated: true, resetLink };
  }

  await transporter.sendMail({
    from: `"CEFOR Escuela de Fútbol" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Recuperación de Contraseña - CEFOR',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #00A651; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">CEFOR</h1>
          <p style="color: white; margin: 5px 0 0;">Escuela de Fútbol</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Hola ${nombre},</h2>
          <p style="color: #666; line-height: 1.6;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta.
          </p>
          <p style="color: #666; line-height: 1.6;">
            Haz clic en el siguiente botón para crear una nueva contraseña:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}"
               style="background: #00A651; color: white; padding: 14px 32px;
                      text-decoration: none; border-radius: 8px; font-size: 16px;
                      display: inline-block;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="color: #666; line-height: 1.6;">
            O copia este enlace en tu navegador:
          </p>
          <p style="background: #fff; padding: 10px; border-radius: 4px; font-size: 12px; word-break: break-all; color: #333;">
            ${resetLink}
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este correo.
          </p>
        </div>
        <div style="padding: 15px; text-align: center; color: #999; font-size: 12px;">
          CEFOR Escuela de Fútbol © ${new Date().getFullYear()}
        </div>
      </div>
    `,
  });

  console.log(`[MAILER] Email enviado a ${email}`);
}
