import { IsString, IsEnum, IsOptional } from 'class-validator';
import { JobStatus } from '../constants';

export class UpdateJobDto {
  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;

  @IsString()
  @IsOptional()
  aiReply?: string;

  @IsString()
  @IsOptional()
  response?: string;
}
