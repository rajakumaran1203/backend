// campaign.dto.ts
import {IsDateString, IsString, IsEmail, IsDate, IsArray, ValidateNested, IsNumber, IsOptional  } from 'class-validator';
import { Type } from 'class-transformer';

class ScheduledFollowupDto {
  @IsNumber()
  index: Number;

  @IsString()
  subject: string;

  @IsString()
  description: string;

  @IsString()
  scheduledAt: string;
}

export class EmailDto {

  @IsString()
  subject: string;

  @IsString()
  description: string;

  @IsDateString()
  @IsOptional()
  dateTime: string = new Date().toISOString();

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduledFollowupDto)
  scheduledFollowups?: ScheduledFollowupDto[];
}

export class CampaignDto {
  @IsString()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  emails: EmailDto;
}
