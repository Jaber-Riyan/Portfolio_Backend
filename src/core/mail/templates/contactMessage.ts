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
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

          <!-- Top accent bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7);height:5px;border-radius:8px 8px 0 0;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background:#ffffff;padding:40px 48px 32px;text-align:center;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <div style="display:inline-block;width:64px;height:64px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:16px;text-align:center;line-height:64px;font-size:28px;">
                      📬
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0f172a;letter-spacing:-0.3px;">You've got a new message</h1>
                    <p style="margin:0;font-size:15px;color:#64748b;">Someone just reached out via your portfolio contact form</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="background:#ffffff;padding:0 48px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <div style="height:1px;background:#f1f5f9;font-size:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- Sender info -->
          <tr>
            <td style="background:#ffffff;padding:28px 48px 0;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f8fafc;border-radius:12px;padding:18px 20px;border:1px solid #e2e8f0;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="width:48px;vertical-align:middle;padding-right:14px;">
                          <div style="width:48px;height:48px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;text-align:center;line-height:48px;color:#ffffff;font-size:20px;font-weight:700;">${initial}</div>
                        </td>
                        <td style="vertical-align:middle;">
                          <p style="margin:0 0 3px;font-size:16px;font-weight:700;color:#0f172a;">${senderName}</p>
                          <a href="mailto:${senderEmail}" style="color:#6366f1;font-size:13px;text-decoration:none;font-weight:500;">${senderEmail}</a>
                        </td>
                        <td style="text-align:right;vertical-align:middle;">
                          <span style="display:inline-block;background:#ede9fe;color:#7c3aed;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.6px;">New</span>
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
            <td style="background:#ffffff;padding:24px 48px 0;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Subject</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#faf5ff;border-radius:10px;padding:14px 18px;border-left:4px solid #8b5cf6;">
                    <p style="margin:0;font-size:15px;font-weight:600;color:#1e1b4b;">${subject}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="background:#ffffff;padding:24px 48px 0;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Message</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f8fafc;border-radius:10px;padding:20px 18px;border:1px solid #e2e8f0;">
                    <p style="margin:0;font-size:15px;color:#334155;line-height:1.75;">${escapedMessage}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background:#ffffff;padding:32px 48px 40px;text-align:center;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <a href="mailto:${senderEmail}?subject=${replySubject}"
                style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:600;letter-spacing:0.2px;">
                Reply to ${senderName} &rarr;
              </a>
              <p style="margin:14px 0 0;font-size:13px;color:#94a3b8;">or email directly: <a href="mailto:${senderEmail}" style="color:#6366f1;text-decoration:none;font-weight:500;">${senderEmail}</a></p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 48px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;border-top:none;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Sent via your portfolio contact form &bull; ${timestamp}</p>
              <p style="margin:0;font-size:11px;color:#cbd5e1;">This is an automated notification — do not reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
