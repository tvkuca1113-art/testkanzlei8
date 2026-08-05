/* ==========================================================================
   KANZLEI JASMINA HODZIC — api/kontakt.js
   Vercel Serverless Function für das Kontaktformular.

   ERFORDERLICHE UMGEBUNGSVARIABLEN (Vercel → Settings → Environment Variables):
     RESEND_API_KEY   API-Schlüssel von resend.com
     MAIL_AN          Zieladresse, z. B. info@steuerberaterin-hodzic.de
     MAIL_VON         Verifizierte Absenderadresse der eigenen Domain,
                      z. B. "Website <website@steuerberaterin-hodzic.de>"

   Fehlt eine Variable, antwortet die Funktion mit HTTP 500. Das Formular
   zeigt dann die direkten Kontaktwege an — es wird NIEMALS ein Erfolg
   vorgetäuscht, den es nicht gab.
   ========================================================================== */

const LIMIT = new Map();                       // einfache Drosselung pro IP

function saeubern(wert, max) {
  if (typeof wert !== 'string') return '';
  return wert.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max || 500);
}

function html(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, fehler: 'Methode nicht erlaubt' });
  }

  /* ---------- Drosselung: max. 5 Anfragen pro IP und Stunde ---------- */
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unbekannt';
  const jetzt = Date.now();
  const eintrag = LIMIT.get(ip) || { n: 0, seit: jetzt };
  if (jetzt - eintrag.seit > 3600000) { eintrag.n = 0; eintrag.seit = jetzt; }
  eintrag.n += 1;
  LIMIT.set(ip, eintrag);
  if (eintrag.n > 5) {
    return res.status(429).json({ ok: false, fehler: 'Zu viele Anfragen. Bitte später erneut versuchen.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    /* ---------- Honigtopf: Bots füllen dieses Feld aus ---------- */
    if (body.website) {
      return res.status(200).json({ ok: true });     // stillschweigend verwerfen
    }

    const daten = {
      name:      saeubern(body.name, 120),
      email:     saeubern(body.email, 160),
      telefon:   saeubern(body.telefon, 60),
      firma:     saeubern(body.firma, 160),
      anliegen:  saeubern(body.anliegen, 120),
      nachricht: saeubern(body.nachricht, 5000)
    };

    if (!daten.name || !daten.email) {
      return res.status(400).json({ ok: false, fehler: 'Name und E-Mail sind erforderlich.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(daten.email)) {
      return res.status(400).json({ ok: false, fehler: 'Bitte eine gültige E-Mail-Adresse angeben.' });
    }

    const KEY = process.env.RESEND_API_KEY;
    const AN  = process.env.MAIL_AN;
    const VON = process.env.MAIL_VON;

    if (!KEY || !AN || !VON) {
      console.error('Kontaktformular: Umgebungsvariablen fehlen (RESEND_API_KEY / MAIL_AN / MAIL_VON).');
      return res.status(500).json({ ok: false, fehler: 'Versand derzeit nicht möglich.' });
    }

    const zeile = (bez, wert) => wert
      ? `<tr><td style="padding:6px 14px 6px 0;color:#7C2B34;font:12px/1.5 monospace;text-transform:uppercase;letter-spacing:.08em;vertical-align:top">${html(bez)}</td><td style="padding:6px 0;color:#191C1F;font:15px/1.6 Helvetica,Arial,sans-serif">${html(wert)}</td></tr>`
      : '';

    const inhalt = `
      <div style="max-width:640px;margin:0 auto;padding:28px;background:#F7F4ED;font-family:Helvetica,Arial,sans-serif">
        <p style="margin:0 0 4px;font:12px/1.5 monospace;letter-spacing:.16em;text-transform:uppercase;color:#7C2B34">Neue Anfrage über die Website</p>
        <h1 style="margin:0 0 22px;font:400 26px/1.2 Georgia,serif;color:#191C1F">${html(daten.name)}</h1>
        <table style="width:100%;border-collapse:collapse;background:#FFFDF9;padding:16px">
          ${zeile('E-Mail', daten.email)}
          ${zeile('Telefon', daten.telefon)}
          ${zeile('Firma', daten.firma)}
          ${zeile('Anliegen', daten.anliegen)}
        </table>
        ${daten.nachricht ? `<div style="margin-top:20px;padding:16px;background:#FFFDF9;border-left:2px solid #7C2B34">
          <p style="margin:0 0 8px;font:12px/1.5 monospace;letter-spacing:.14em;text-transform:uppercase;color:#7C2B34">Nachricht</p>
          <p style="margin:0;font:15px/1.7 Helvetica,Arial,sans-serif;color:#191C1F;white-space:pre-wrap">${html(daten.nachricht)}</p>
        </div>` : ''}
        <p style="margin:22px 0 0;font:12px/1.6 Helvetica,Arial,sans-serif;color:#8A8578">
          Eingegangen am ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })} Uhr.
        </p>
      </div>`;

    const antwort = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: VON,
        to: [AN],
        reply_to: daten.email,
        subject: `Website-Anfrage: ${daten.anliegen || 'Erstgespräch'} — ${daten.name}`,
        html: inhalt
      })
    });

    if (!antwort.ok) {
      const text = await antwort.text();
      console.error('Resend-Fehler:', antwort.status, text);
      return res.status(502).json({ ok: false, fehler: 'Versand fehlgeschlagen.' });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Kontaktformular-Fehler:', err);
    return res.status(500).json({ ok: false, fehler: 'Unerwarteter Fehler.' });
  }
}
