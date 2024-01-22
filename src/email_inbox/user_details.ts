import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EmailCredentials extends Document {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  password: string;
}

export const EmailCredentialsSchema = SchemaFactory.createForClass(EmailCredentials);