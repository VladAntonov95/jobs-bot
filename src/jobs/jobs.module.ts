import { Module, forwardRef } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TelegramModule } from '../telegram/telegram.module';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [forwardRef(() => TelegramModule), AIModule],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
