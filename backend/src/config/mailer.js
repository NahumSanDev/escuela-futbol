import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(email, nombre, resetLink) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[MAILER] RESEND_API_KEY no configurada. Enlace para ${email}: ${resetLink}`);
    return { simulated: true, resetLink };
  }

  const from = process.env.RESEND_FROM || 'onboarding@resend.dev';

  await resend.emails.send({
    from,
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

export async function sendTestEmail() {
  if (!process.env.RESEND_API_KEY) {
    console.log('[MAILER] RESEND_API_KEY no configurada');
    return;
  }

  const from = process.env.RESEND_FROM || 'onboarding@resend.dev';

  const { data, error } = await resend.emails.send({
    from,
    to: 'delivered@resend.dev',
    subject: 'Test CEFOR',
    html: '<p>Configuración de email funcionando</p>',
  });

  if (error) {
    console.error('[MAILER] Error test:', error);
  } else {
    console.log('[MAILER] Test exitoso:', data);
  }
}
