const otpStore = new Map();

export function storeOtp(email, code) {
  otpStore.set(email, { code, expiresAt: Date.now() + 600000 });
}

export function verifyOtp(email, code) {
  const stored = otpStore.get(email);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return false;
  }
  if (stored.code !== code) return false;
  otpStore.delete(email);
  return true;
}

export async function sendSmsOtp(phone, code) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE;

  if (!accountSid || !authToken || !from) {
    console.log(`[SMS] Twilio no configurado. Código para ${phone}: ${code}`);
    return { simulated: true, code };
  }

  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phone,
          From: from,
          Body: `CEFOR - Tu código de recuperación es: ${code}. Válido por 10 minutos.`,
        }),
      }
    );

    if (response.ok) {
      console.log(`[SMS] Código enviado a ${phone}`);
    } else {
      const err = await response.text();
      console.error(`[SMS] Error Twilio (${response.status}): ${err}`);
    }
  } catch (err) {
    console.error(`[SMS] Error al enviar SMS a ${phone}:`, err.message);
  }
}
