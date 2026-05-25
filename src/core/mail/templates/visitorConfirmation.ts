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
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

          <!-- Top accent bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#10b981,#6366f1,#8b5cf6);height:5px;border-radius:8px 8px 0 0;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background:#ffffff;padding:40px 48px 32px;text-align:center;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <div style="display:inline-block;width:64px;height:64px;background:#dcfce7;border-radius:50%;text-align:center;line-height:64px;font-size:30px;">
                      ✅
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0f172a;letter-spacing:-0.3px;">Message received, ${senderName}!</h1>
                    <p style="margin:0;font-size:15px;color:#64748b;line-height:1.6;">Thanks for reaching out. I'll get back to you within <strong style="color:#0f172a;">24–48 hours</strong>.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message recap -->
          <tr>
            <td style="background:#ffffff;padding:0 48px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <div style="height:1px;background:#f1f5f9;">&nbsp;</div>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:28px 48px 0;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Your message summary</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f8fafc;border-radius:12px;padding:20px;border:1px solid #e2e8f0;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px;">Subject</p>
                    <p style="margin:0 0 16px;font-size:15px;font-weight:600;color:#1e293b;padding-bottom:16px;border-bottom:1px solid #e2e8f0;">${subject}</p>
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px;">Message</p>
                    <p style="margin:0;font-size:14px;color:#475569;line-height:1.7;">${escapedMessage}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's next -->
          <tr>
            <td style="background:#ffffff;padding:28px 48px 0;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">What happens next</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <!-- Step 1 -->
                <tr>
                  <td style="padding-bottom:14px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-right:12px;">
                          <div style="width:32px;height:32px;background:#ede9fe;border-radius:8px;text-align:center;line-height:32px;font-size:14px;font-weight:700;color:#7c3aed;">1</div>
                        </td>
                        <td style="vertical-align:middle;">
                          <p style="margin:0;font-size:14px;color:#334155;"><strong style="color:#0f172a;">${ownerName}</strong> reviews your message</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Step 2 -->
                <tr>
                  <td style="padding-bottom:14px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-right:12px;">
                          <div style="width:32px;height:32px;background:#ede9fe;border-radius:8px;text-align:center;line-height:32px;font-size:14px;font-weight:700;color:#7c3aed;">2</div>
                        </td>
                        <td style="vertical-align:middle;">
                          <p style="margin:0;font-size:14px;color:#334155;">You'll receive a reply within <strong style="color:#0f172a;">24–48 hours</strong></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Step 3 -->
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-right:12px;">
                          <div style="width:32px;height:32px;background:#ede9fe;border-radius:8px;text-align:center;line-height:32px;font-size:14px;font-weight:700;color:#7c3aed;">3</div>
                        </td>
                        <td style="vertical-align:middle;">
                          <p style="margin:0;font-size:14px;color:#334155;">Check your inbox — and your spam folder just in case 😊</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="background:#ffffff;padding:32px 48px 40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <div style="height:1px;background:#f1f5f9;margin-bottom:24px;">&nbsp;</div>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:48px;vertical-align:middle;padding-right:14px;">
                    <div style="width:48px;height:48px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;text-align:center;line-height:48px;color:#ffffff;font-size:20px;font-weight:700;">J</div>
                  </td>
                  <td style="vertical-align:middle;">
                    <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#0f172a;">${ownerName}</p>
                    <p style="margin:0;font-size:13px;color:#64748b;">Full-Stack Developer &bull; Portfolio</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 48px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;border-top:none;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">This is an automated confirmation — please do not reply to this email.</p>
              <p style="margin:0;font-size:11px;color:#cbd5e1;">${timestamp}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
