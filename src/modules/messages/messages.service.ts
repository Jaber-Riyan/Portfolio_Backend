import { messagesRepository } from './messages.repository';
import { IMessageDocument } from './messages.interface';
import { SendMessageDto } from './messages.types';
import { ApiError } from '../../shared/errors/ApiError';
import { sendMail } from '../../core/mail/mailer';
import { contactMessageTemplate } from '../../core/mail/templates/contactMessage';
import { visitorConfirmationTemplate } from '../../core/mail/templates/visitorConfirmation';
import { env } from '../../config/env';

class MessagesService {
  async send(dto: SendMessageDto): Promise<IMessageDocument> {
    const subject = dto.subject?.trim() || 'New message from your portfolio';
    const mailerReady = env.smtp.user && env.smtp.pass;

    const saved = await messagesRepository.create({
      senderName: dto.senderName,
      senderEmail: dto.senderEmail,
      subject,
      message: dto.message,
    } as Partial<IMessageDocument>);

    if (mailerReady) {
      // Notify owner
      sendMail({
        to: env.notifyEmail,
        subject: `📬 New message from ${dto.senderName}: ${subject}`,
        html: contactMessageTemplate({
          senderName: dto.senderName,
          senderEmail: dto.senderEmail,
          subject,
          message: dto.message,
        }),
      }).catch((err) => console.error('[Mailer] Owner notification failed:', err));

      // Confirm to visitor
      sendMail({
        to: dto.senderEmail,
        subject: `✅ Got your message! — ${subject}`,
        html: visitorConfirmationTemplate({
          senderName: dto.senderName,
          subject,
          message: dto.message,
        }),
      }).catch((err) => console.error('[Mailer] Visitor confirmation failed:', err));
    }

    return saved;
  }

  async getAll(): Promise<IMessageDocument[]> {
    return messagesRepository.findAll({}, { createdAt: -1 });
  }

  async markRead(id: string): Promise<IMessageDocument> {
    const doc = await messagesRepository.updateById(id, { read: true });
    if (!doc) throw ApiError.notFound('Message not found');
    return doc;
  }

  async delete(id: string): Promise<IMessageDocument> {
    const doc = await messagesRepository.deleteById(id);
    if (!doc) throw ApiError.notFound('Message not found');
    return doc;
  }
}

export const messagesService = new MessagesService();
