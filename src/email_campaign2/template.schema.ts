import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ScheduledFollowup, ScheduledFollowupSchema } from './scheduled-followup.schema';

@Schema()
export class Template extends Document {
  @Prop()
  name: string;

  @Prop({
    type: {
      subject: String,
      description: String,
      scheduledFollowups: [ScheduledFollowupSchema], // Specify the type for scheduledFollowups
    },
  })
  emails: {
    subject: string;
    description: string;
    scheduledFollowups: ScheduledFollowup[];
  };
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
