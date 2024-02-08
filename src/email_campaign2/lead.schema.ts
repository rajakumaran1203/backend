import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Lead extends Document {
  @Prop()
  name: string;

  @Prop()
  email: string;
  
  @Prop()
  isActive: Boolean;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
