import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ScheduledFollowup extends Document {
  @Prop()
  index: number;

  @Prop()
  subject: string;

  @Prop()
  description: string;

  @Prop()
  scheduledAt: string;
}

export const ScheduledFollowupSchema = SchemaFactory.createForClass(ScheduledFollowup);
