export interface VisitorConfirmationData {
  senderName: string;
  subject: string;
  message: string;
  ownerName?: string;
}

export const visitorConfirmationTemplate = (data: VisitorConfirmationData): string => {
  const { senderName, subject, message, ownerName = 'Jaber Riyan' } = data;
  const escapedMessage = message.replace(/\n/g, '<br>');
  const timestamp = new Date().toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message Received</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0ea5e9 0%,#6366f1 50%,#8b5cf6 100%);padding:48px 40px 36px;border-radius:20px 20px 0 0;text-align:center;">
              <div style="font-size:52px;margin-bottom:16px;">✅</div>
              <h1 style="color:#ffffff;margin:0 0 10px;font-size:26px;font-weight:800;letter-spacing:-0.5px;">Message Received!</h1>
              <p style="color:rgba(255,255,255,0.8);margin:0;font-size:15px;">Hi <strong>${senderName}</strong>, your message has been sent successfully.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#1e293b;padding:36px 40px 0;">
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 24px;">
                Thank you for reaching out! I've received your message and will get back to you as soon as possible, usually within <strong style="color:#f1f5f9;">24–48 hours</strong>.
              </p>

              <!-- Message recap card -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#0f172a;border-radius:14px;padding:24px;border:1px solid #1e3a5f;">
                    <p style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;margin:0 0 6px;">Your message</p>
                    <p style="color:#818cf8;font-size:15px;font-weight:600;margin:0 0 16px;padding-bottom:16px;border-bottom:1px solid #1e293b;">${subject}</p>
                    <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0;">${escapedMessage}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What to expect -->
          <tr>
            <td style="background:#1e293b;padding:28px 40px 0;">
              <p style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;margin:0 0 16px;">What happens next?</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 14px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px;vertical-align:top;padding-right:12px;">
                          <div style="width:28px;height:28px;background:rgba(99,102,241,0.15);border-radius:50%;text-align:center;line-height:28px;font-size:13px;border:1px solid rgba(99,102,241,0.3);">1</div>
                        </td>
                        <td style="vertical-align:top;padding-top:4px;">
                          <p style="color:#cbd5e1;font-size:14px;margin:0;"><strong style="color:#f1f5f9;">${ownerName}</strong> will review your message</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 14px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px;vertical-align:top;padding-right:12px;">
                          <div style="width:28px;height:28px;background:rgba(99,102,241,0.15);border-radius:50%;text-align:center;line-height:28px;font-size:13px;border:1px solid rgba(99,102,241,0.3);">2</div>
                        </td>
                        <td style="vertical-align:top;padding-top:4px;">
                          <p style="color:#cbd5e1;font-size:14px;margin:0;">You'll receive a reply within <strong style="color:#f1f5f9;">24–48 hours</strong></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px;vertical-align:top;padding-right:12px;">
                          <div style="width:28px;height:28px;background:rgba(99,102,241,0.15);border-radius:50%;text-align:center;line-height:28px;font-size:13px;border:1px solid rgba(99,102,241,0.3);">3</div>
                        </td>
                        <td style="vertical-align:top;padding-top:4px;">
                          <p style="color:#cbd5e1;font-size:14px;margin:0;">Check your inbox (and spam folder just in case 😄)</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider + signature -->
          <tr>
            <td style="background:#1e293b;padding:32px 40px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="height:1px;background:linear-gradient(90deg,transparent,#334155,transparent);font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:48px;vertical-align:middle;padding-right:14px;">
                    <div style="width:48px;height:48px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;text-align:center;line-height:48px;color:#ffffff;font-size:20px;font-weight:800;">J</div>
                  </td>
                  <td style="vertical-align:middle;">
                    <p style="margin:0 0 2px;color:#f1f5f9;font-size:15px;font-weight:700;">${ownerName}</p>
                    <p style="margin:0;color:#64748b;font-size:13px;">Full-Stack Developer</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0a0f1e;padding:24px 40px;border-radius:0 0 20px 20px;border-top:1px solid #1e293b;text-align:center;">
              <p style="color:#334155;font-size:12px;margin:0 0 6px;">This is an automated confirmation — please do not reply to this email.</p>
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
