import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Scheduler extends Document {
  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop()
  rampUpCount: string;

  @Prop({
    type: {
      selectedSenders: [String], 
    },
  })
  senderIds: {
    selectedSenders: string[];
  };
}

export const SchedulerSchema = SchemaFactory.createForClass(Scheduler);
