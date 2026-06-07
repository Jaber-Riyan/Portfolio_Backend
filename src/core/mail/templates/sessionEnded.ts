import { IChatSessionDocument } from '../../../modules/chat/chat.interface';

interface MessageRecord {
  role: string;
  content: string;
  createdAt: Date;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export function sessionEndedTemplate(
  session: IChatSessionDocument,
  messages: MessageRecord[],
  durationSeconds: number,
): string {
  const messageRows = messages
    .map((m) => {
      const isUser = m.role === 'user';
      const label = isUser ? '👤 User' : '🤖 Assistant';
      const color = isUser ? '#2563eb' : '#16a34a';
      const time = m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : '';
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;white-space:nowrap;vertical-align:top;font-weight:600;color:${color};font-size:13px;width:110px;">
            ${label}<br><span style="font-weight:400;color:#9ca3af;font-size:11px;">${time}</span>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#374151;font-size:14px;line-height:1.5;">
            ${escapeHtml(m.content)}
          </td>
        </tr>`;
    })
    .join('');

  const deviceRows = session.deviceInfo
    ? [
        ['Browser', session.deviceInfo.browser],
        ['OS', session.deviceInfo.os],
        ['Device Type', session.deviceInfo.deviceType],
        ['Language', session.deviceInfo.language],
        ['Screen', `${session.deviceInfo.screenWidth}×${session.deviceInfo.screenHeight}`],
        ['Network', session.deviceInfo.networkProviderName],
      ]
        .filter(([, v]) => v)
        .map(
          ([k, v]) => `
          <tr>
            <td style="padding:5px 10px;color:#6b7280;font-size:13px;width:120px;">${k}</td>
            <td style="padding:5px 10px;color:#1f2937;font-size:13px;">${escapeHtml(String(v))}</td>
          </tr>`,
        )
        .join('')
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:680px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e40af,#7c3aed);padding:28px 32px;">
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;">💬 Portfolio Chat Session Ended</h1>
      <p style="color:rgba(255,255,255,.75);margin:6px 0 0;font-size:13px;">${new Date().toLocaleString()}</p>
    </div>

    <!-- Stats -->
    <div style="padding:24px 32px;border-bottom:1px solid #f0f0f0;">
      <h2 style="margin:0 0 16px;font-size:15px;font-weight:600;color:#111827;">Session Summary</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;width:50%;">Session ID</td>
          <td style="padding:6px 0;color:#1f2937;font-size:13px;font-family:monospace;">${escapeHtml(session.sessionId)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Device ID</td>
          <td style="padding:6px 0;color:#1f2937;font-size:13px;font-family:monospace;">${escapeHtml(session.deviceId)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Duration</td>
          <td style="padding:6px 0;color:#1f2937;font-size:13px;font-weight:600;">${formatDuration(durationSeconds)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Messages Exchanged</td>
          <td style="padding:6px 0;color:#1f2937;font-size:13px;font-weight:600;">${session.totalMessages}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Tokens Used</td>
          <td style="padding:6px 0;color:#1f2937;font-size:13px;">${session.totalTokensUsed.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Started At</td>
          <td style="padding:6px 0;color:#1f2937;font-size:13px;">${session.startedAt?.toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <!-- Device Info -->
    ${deviceRows ? `
    <div style="padding:24px 32px;border-bottom:1px solid #f0f0f0;background:#f8fafc;">
      <h2 style="margin:0 0 12px;font-size:15px;font-weight:600;color:#111827;">Device Information</h2>
      <table style="width:100%;border-collapse:collapse;">${deviceRows}</table>
    </div>` : ''}

    <!-- Conversation -->
    <div style="padding:24px 32px;">
      <h2 style="margin:0 0 16px;font-size:15px;font-weight:600;color:#111827;">
        Conversation (${messages.length} message${messages.length !== 1 ? 's' : ''})
      </h2>
      ${messages.length > 0
        ? `<table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">${messageRows}</table>`
        : '<p style="color:#9ca3af;font-size:14px;">No messages recorded.</p>'}
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #f0f0f0;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">Portfolio AI Assistant — Automated session report</p>
    </div>

  </div>
</body>
</html>`;
}
