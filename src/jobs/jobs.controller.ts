import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // clean text from spaces divs and other
  @Get('test')
  testCleaner() {
    return this.jobsService.testCleaner();
  }

  @Get()
  async findAllJobs() {
    return this.jobsService.findAllJobs();
  }

  @Get(':id')
  async findeUniqueJob(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findJobById(id);
  }

  @Post()
  async createJob(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.createJob(createJobDto);
  }

  @Patch(':id')
  async updateJobInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.updateJobInfo(id, updateJobDto);
  }

  @Delete(':id')
  async deleteJob(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.deleteJob(id);
  }
}
