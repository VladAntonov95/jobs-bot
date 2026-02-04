import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf, Context, Markup } from 'telegraf';

@Injectable()
export class TelegramService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}
  async sendMessage(text: string, jobId: number) {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    console.log('Sending message to:', chatId);
    if (!chatId) throw new Error('CHAT_ID not found');
    try {
      await this.bot.telegram.sendMessage(
        chatId,
        text,
        Markup.inlineKeyboard([
          Markup.button.callback('Approve', 'approve:' + jobId),
          Markup.button.callback('Reject', 'reject:' + jobId),
        ]),
      );
      console.log('Message sent successfuly');
    } catch (e) {
      console.error('Telegram Error:', e);
    }
  }
}
