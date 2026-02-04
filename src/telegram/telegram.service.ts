import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf, Context, Markup } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/types';

@Injectable()
export class TelegramService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}
  async sendMessage(
    text: string,
    jobId: number,
    action: 'NEW_JOB' | 'AI_REPLY' = 'NEW_JOB',
  ) {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!chatId) throw new Error('CHAT_ID not found');
    let keyboard: { reply_markup: InlineKeyboardMarkup } | undefined;
    if (action === 'NEW_JOB') {
      keyboard = Markup.inlineKeyboard([
        Markup.button.callback('Approve', 'approve:' + jobId),
        Markup.button.callback('Reject', 'reject:' + jobId),
      ]);
    } else if (action === 'AI_REPLY') {
      keyboard = Markup.inlineKeyboard([
        Markup.button.callback('Send', 'send:' + jobId),
        Markup.button.callback('Edit', 'edit:' + jobId),
      ]);
    }
    const finalOptions = {
      parse_mode: 'HTML' as const,
      ...keyboard,
    };
    try {
      await this.bot.telegram.sendMessage(chatId, text, finalOptions);
    } catch (e) {
      console.error('Telegram Error:', e);
    }
  }
}
