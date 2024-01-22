import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EmailCount extends Document {

  @Prop({ default: 0 })
  emailSent: number;

  @Prop({ default: 0 })
  warmupEmailSent: number;    

  @Prop({ type: String, unique: true})
  emailAddress: string; 

  @Prop({ default: 0 })
  Seen:number;

  @Prop({ default: 0 })
  Unseen:number;
}

export const EmailCountSchema = SchemaFactory.createForClass(EmailCount);


