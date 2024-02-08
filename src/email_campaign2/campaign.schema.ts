import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Lead, LeadSchema } from './lead.schema';
import { Template, TemplateSchema } from './template.schema';
import { Scheduler, SchedulerSchema } from './scheduler.schema';

@Schema()
export class Campaign extends Document {
  @Prop({ type: [LeadSchema] })
  leads: Lead[];

  @Prop({ type: TemplateSchema })
  template: Template;

  @Prop({ type: SchedulerSchema })
  scheduler: Scheduler;

  @Prop()
  isDisabled: boolean;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
