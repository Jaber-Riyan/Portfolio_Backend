export interface ContactEmailData {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}

export const contactMessageTemplate = (data: ContactEmailData): string => {
  const { senderName, senderEmail, subject, message } = data;
  const initial = senderName.charAt(0).toUpperCase();
  const timestamp = new Date().toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });
  const escapedMessage = message.replace(/\n/g, '<br>');
  const replySubject = encodeURIComponent(`Re: ${subject}`);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Message</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);padding:48px 40px 36px;border-radius:20px 20px 0 0;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <div style="display:inline-block;width:72px;height:72px;background:rgba(255,255,255,0.15);border-radius:50%;border:2px solid rgba(255,255,255,0.3);text-align:center;line-height:72px;font-size:32px;">
                      ✉️
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="color:#ffffff;margin:0 0 10px;font-size:28px;font-weight:800;letter-spacing:-0.5px;line-height:1.2;">New Message!</h1>
                    <p style="color:rgba(255,255,255,0.75);margin:0;font-size:15px;font-weight:400;">Someone reached out via your portfolio contact form</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sender Card -->
          <tr>
            <td style="background:#1e293b;padding:32px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#0f172a;border-radius:14px;padding:20px 24px;border:1px solid #334155;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:52px;vertical-align:middle;padding-right:16px;">
                          <div style="width:52px;height:52px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;text-align:center;line-height:52px;color:#ffffff;font-size:22px;font-weight:800;">${initial}</div>
                        </td>
                        <td style="vertical-align:middle;">
                          <p style="margin:0 0 4px;color:#f1f5f9;font-size:17px;font-weight:700;">${senderName}</p>
                          <a href="mailto:${senderEmail}" style="color:#818cf8;font-size:14px;text-decoration:none;font-weight:500;">${senderEmail}</a>
                        </td>
                        <td style="text-align:right;vertical-align:middle;">
                          <span style="display:inline-block;background:rgba(99,102,241,0.15);color:#818cf8;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;border:1px solid rgba(99,102,241,0.3);text-transform:uppercase;letter-spacing:0.8px;">New Message</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Subject -->
          <tr>
            <td style="background:#1e293b;padding:24px 40px 0;">
              <p style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;margin:0 0 10px;">Subject</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#0f172a;border-radius:10px;padding:14px 20px;border-left:3px solid #6366f1;border:1px solid #1e3a5f;border-left:3px solid #6366f1;">
                    <p style="color:#f1f5f9;font-size:16px;font-weight:600;margin:0;">${subject}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="background:#1e293b;padding:24px 40px 0;">
              <p style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;margin:0 0 10px;">Message</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#0f172a;border-radius:14px;padding:24px;border:1px solid #1e3a5f;">
                    <p style="color:#cbd5e1;font-size:15px;line-height:1.8;margin:0;">${escapedMessage}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="background:#1e293b;padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height:1px;background:linear-gradient(90deg,transparent,#334155,transparent);font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="background:#1e293b;padding:0 40px 40px;text-align:center;">
              <a href="mailto:${senderEmail}?subject=${replySubject}"
                style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.3px;box-shadow:0 4px 20px rgba(99,102,241,0.4);">
                Reply to ${senderName} &rarr;
              </a>
              <p style="color:#475569;font-size:13px;margin:16px 0 0;">Or copy their email: <a href="mailto:${senderEmail}" style="color:#818cf8;text-decoration:none;">${senderEmail}</a></p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0a0f1e;padding:24px 40px;border-radius:0 0 20px 20px;border-top:1px solid #1e293b;text-align:center;">
              <p style="color:#334155;font-size:12px;margin:0 0 6px;font-weight:500;">&#128275; This message was sent via your portfolio contact form</p>
              <p style="color:#1e293b;font-size:11px;margin:0;">${timestamp}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
