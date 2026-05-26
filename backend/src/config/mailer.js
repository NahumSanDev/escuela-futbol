export async function sendResetEmail(email, nombre, resetLink) {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    console.log(`[MAILER] SENDGRID_API_KEY no configurada. Enlace para ${email}: ${resetLink}`);
    return { simulated: true, resetLink };
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email }],
          subject: 'Recuperación de Contraseña - CEFOR',
        }],
        from: { email: process.env.SENDGRID_FROM || 'noreply@cefor.com', name: 'CEFOR Escuela de Fútbol' },
        content: [{
          type: 'text/html',
          value: `
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
        }],
      }),
    });

    if (response.ok) {
      console.log(`[MAILER] Email enviado a ${email}`);
    } else {
      const err = await response.text();
      console.error(`[MAILER] Error SendGrid (${response.status}): ${err}`);
      console.log(`[MAILER] Enlace de respaldo: ${resetLink}`);
    }
  } catch (err) {
    console.error(`[MAILER] Error al enviar email a ${email}:`, err.message);
    console.log(`[MAILER] Enlace de respaldo: ${resetLink}`);
  }
}
