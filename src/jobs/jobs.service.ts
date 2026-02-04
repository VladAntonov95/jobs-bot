import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { TelegramService } from '../telegram/telegram.service';
import { GeminiService } from '../ai/gemini.service';
import { JobStatus } from './constants';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => TelegramService))
    private telegramService: TelegramService,
    private geminiService: GeminiService,
  ) {}

  async createJob(data: CreateJobDto) {
    const job = await this.prisma.job.create({ data });
    const description = job.description
      ? `\n\n<b>Описание:</b>\n${job.description.slice(0, 300)}...`
      : '';

    await this.telegramService.sendMessage(
      `<b>Новая вакансия:</b> ${job.title}\n<b>Компания:</b> ${job.company} ${description}\n<b>Link:</b> <a href="${job.link}">${job.link}</a>`,
      job.id,
      'NEW_JOB',
    );

    return job;
  }

  async findAllJobs() {
    return this.prisma.job.findMany();
  }

  async findJobById(id: number) {
    const job = await this.prisma.job.findUnique({
      where: {
        id: id,
      },
    });

    if (!job) throw new NotFoundException();

    return job;
  }

  async updateJobInfo(id: number, data: UpdateJobDto) {
    await this.findJobById(id);

    return this.prisma.job.update({
      where: { id },
      data,
    });
  }

  async deleteJob(id: number) {
    await this.findJobById(id);

    await this.prisma.job.delete({
      where: {
        id: id,
      },
    });
  }

  async processApproveJob(jobId: number) {
    const job = await this.findJobById(jobId);
    const title = job.title;
    const company = job.company;
    const description = job.description;
    await this.updateJobInfo(jobId, { status: JobStatus.USER_APPROVED });
    const letter = await this.geminiService.generateCoverLetter(
      title,
      company,
      description || 'No description in this vacancy',
    );

    await this.updateJobInfo(jobId, {
      status: JobStatus.AI_DONE,
      aiReply: letter,
    });

    this.telegramService.sendMessage(
      `<b>AI Reply:</b>\n\n${letter}`,
      job.id,
      'AI_REPLY',
    );
  }

  private cleanDescription(text: string): string {
    if (!text) return '';

    let clean = text.replace(/<[^>]*>/g, '');

    clean = clean.replace(/\s+/g, ' ');

    return clean.trim();
  }

  testCleaner() {
    const trash = '  <h1>Привет,   Влад!</h1>  <p>Это   тест.</p>  ';
    return this.cleanDescription(trash);
  }
}
