// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type CampaignDocument = Campaign & Document;

// @Schema()
// export class Campaign {
//   @Prop()
//   name: string;

//   @Prop({
//     type: 
//       {
//         subject: String,
//         description: String,
//         dateTime: Date, // Change type to String
//         scheduledFollowups: [
//           {
//             index: Number,
//             subject: String,
//             description: String,
//             scheduledAt: String,
//           },
//         ],
//       },
//   })
//   emails: {
//     subject: string;
//     description: string;
//     dateTime: Date; // Change type to String
//     scheduledFollowups?: {
//       index: Number
//       subject: string;
//       description: string;
//       scheduledAt: string;
//     }[];
//   }[];
// }

// export const CampaignSchema = SchemaFactory.createForClass(Campaign);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CampaignDocument = Campaign & Document;

@Schema()
export class Campaign {
  @Prop()
  name: string;

  @Prop({
    type: 
      {
        subject: String,
        description: String,
        dateTime: { type: Date, default: Date.now }, // Set default to current date and time
        scheduledFollowups: [
          {
            index: Number,
            subject: String,
            description: String,
            scheduledAt: String,
          },
        ],
      },
  })
  emails: {
    subject: string;
    description: string;
    dateTime: Date;
    scheduledFollowups?: {
      index: Number
      subject: string;
      description: string;
      scheduledAt: string;
    }[];
  }[];
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
