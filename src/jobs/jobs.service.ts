import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async createJob(data: CreateJobDto) {
    return this.prisma.job.create({ data });
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
