import { Inject, forwardRef } from '@nestjs/common';
import { Update, Start, Ctx, Action } from 'nestjs-telegraf';
import { Context as TelegrafContext } from 'telegraf';
import { JobsService } from '../jobs/jobs.service';
import { JobStatus } from '../jobs/constants';

interface Context extends TelegrafContext {
  match: RegExpExecArray;
}

@Update()
export class TelegramUpdate {
  constructor(
    @Inject(forwardRef(() => JobsService))
    private readonly jobService: JobsService,
  ) {}

  @Start()
  async startMessage(@Ctx() ctx: Context) {
    await ctx.reply('Привет! Я готов искать работу.');
  }

  @Action(/approve:(.+)/)
  async onApprove(@Ctx() ctx: Context) {
    const jobId = parseInt(ctx.match[1]);
    await this.jobService.processApproveJob(jobId);
    await ctx.answerCbQuery('Работа добавлена в список... Готовлю письмо.');
    const message = ctx.callbackQuery?.message;
    if (!message || !('text' in message)) return;
    await ctx.editMessageText(`${message.text}\n\nОДОБРЕНО (Готовим письмо)`);
  }

  @Action(/reject:(.+)/)
  async onReject(@Ctx() ctx: Context) {
    const jobId = parseInt(ctx.match[1]);
    await this.jobService.updateJobInfo(jobId, {
      status: JobStatus.USER_REJECTED,
    });
    await ctx.answerCbQuery('Понял, эта работа нам не подходит, удаляю...');
    const message = ctx.callbackQuery?.message;
    if (!message || !('text' in message)) return;
    await ctx.editMessageText(`${message.text}\n\nУДАЛЕНО`);
  }
}
