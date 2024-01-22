import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class email_data extends Document {
  @Prop({type: [String], required: true })
  Emaillist: string[];
}

export const emailListSchema = SchemaFactory.createForClass(email_data);

