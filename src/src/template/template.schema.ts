import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Template extends Document {
  @Prop()
  name: string;

  @Prop()
  subject: string;

  @Prop()
  description: string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);