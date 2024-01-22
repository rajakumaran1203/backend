import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Campaign } from '../email_campaign1/campaign.schema'; 

export type CronModelDocument = CronModel & Document;

@Schema()
export class CronModel {
  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop()
  rampUpCount: number;

  @Prop()
  isActive: boolean;
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Campaign' })
  campaignId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [String], default: [] }) // Assuming you want to store an array of strings for selectedSenders
  senderIds: string[];
}

export const CronModelSchema = SchemaFactory.createForClass(CronModel);
