import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EmailCount extends Document {

  @Prop({ default: 0 })
  failureCount: number;

  @Prop({ default: 0 })
  totalMessages: number;    

  @Prop()
  email: string; 
}

export const EmailCountSchema = SchemaFactory.createForClass(EmailCount);


