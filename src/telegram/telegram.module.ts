import { Module, forwardRef } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => {
        if (!process.env.TELEGRAM_BOT_TOKEN)
          throw new Error('BOT TOKEN MISSING');
        return {
          token: process.env.TELEGRAM_BOT_TOKEN,
        };
      },
    }),
    forwardRef(() => JobsModule),
  ],
  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TelegramModule {}
