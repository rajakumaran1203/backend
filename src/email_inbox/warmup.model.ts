import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EmailWarmUp extends Document {

  @Prop({ default: 0 })
  emailSent: number;

  @Prop({ default: 0 })
  warmupEmailSent: number;    

  @Prop({ type: String, unique: true })
  emailAddress: string; 

  @Prop({ default: 0 })
  Seen: number;

  @Prop({ default: 0 })
  Unseen: number;

  @Prop({ type: Boolean })
  isWarmUpOn: boolean;

  @Prop({type: Number})
  totalWarmUpEmailsPerDay: number;

  @Prop({ type: Boolean })
  dailyRampUpEnabled: boolean;

  @Prop({ type: Number })
  rampUpIncrement: number;

  @Prop({ type: String, unique: true })
  handleCardSelection: string;
}

export const EmailWarmUpSchema = SchemaFactory.createForClass(EmailWarmUp);
