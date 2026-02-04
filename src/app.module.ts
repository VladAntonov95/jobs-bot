import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { JobsModule } from './jobs/jobs.module';
import { TelegramModule } from './telegram/telegram.module';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [PrismaModule, JobsModule, TelegramModule, AIModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
