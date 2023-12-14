// user.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  // ... other properties and methods
}

export const UserModel = SchemaFactory.createForClass(User);
