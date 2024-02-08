import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign } from './campaign.schema';
import * as nodemailer from 'nodemailer';
import { SchedulerService } from './scheduler.service';
import * as schedule from 'node-schedule';
import { EmailCredentials } from './user_details';

@Injectable()
export class CampaignService {
  private transporters: nodemailer.Transporter[];
  constructor(@InjectModel(Campaign.name) private readonly CampaignModel: Model<Campaign>,
  @InjectModel(EmailCredentials.name) private readonly emailCredentialModel: Model<EmailCredentials>
   ) { this.setupTransporters();}

   private async setupTransporters(): Promise<void> {
    const allCredentials = await this.getEmailCredentials();

 
      // Create an array to store multiple transporter instances
      this.transporters = [ nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: allCredentials.user,
            pass: allCredentials.password,
          },
        })];
    
  } 

  async getAllMainStructures(): Promise<Campaign[]> {
    return this.CampaignModel.find().exec();
  }

  async getMainStructureById(id: string): Promise<Campaign> {
    const mainStructure = await this.CampaignModel.findById(id).exec();
    if (!mainStructure) {
      throw new NotFoundException(`Main Structure with ID ${id} not found`);
    }
    return mainStructure;
  }

  async createMainStructure(mainStructure: Campaign): Promise<Campaign> {
    const createdMainStructure = new this.CampaignModel(mainStructure);
    return createdMainStructure.save();
  }

  async updateMainStructure(id: string, mainStructure: Campaign): Promise<Campaign> {
    const updatedMainStructure = await this.CampaignModel.findByIdAndUpdate(id, mainStructure, { new: true }).exec();
    if (!updatedMainStructure) {
      throw new NotFoundException(`Main Structure with ID ${id} not found`);
    }
    return updatedMainStructure;
  }

  async deleteMainStructure(id: string): Promise<void> {
    const result = await this.CampaignModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Main Structure with ID ${id} not found`);
    }
  }
   
  async sendMail(to: string, subject: string, text: string) {
    // Use the first transporter in the array
    const emailCredentials = await this.getEmailCredentials();
    // const senderid = await this.maildata();
    // if (emailCredentials.user === senderid) {
    const transporter = this.transporters[0];

    const mailOptions = {
      from: emailCredentials.user, // Update with your from email
      to,
      subject,
      text,
    };
    
    const campaigns = await this.CampaignModel.findOneAndUpdate(
      { "leads.email": to },
      { $set: { "leads.$.isActive": false } }
    ).exec();
    console.log(campaigns,"send deatils in mongodb");
    // Send mail using the selected transporter
    await transporter.sendMail(mailOptions);
    console.log(mailOptions,"sent")
  // }
}

  async getEmailCredentials() {
        const emailCredentials = await this.emailCredentialModel.findOne().exec();
        return emailCredentials;
      }

  async getAllCampaigns(): Promise<Campaign[]> {
  const pipeline = [
      {
        $match: {
          $and: [
            { "isDisabled": true },
            {
              $or: [
                { "leads.isActive": null },
                { "leads.isActive": true }
              ]
            }
          ]
        }
      }
      // {
      //   $addFields: {
      //     leads: {
      //       $filter: {
      //         input: "$leads",
      //         as: "lead",
      //         cond: { $eq: ["$$lead.isActive", true] }
      //       }
      //     }
      //   }
      // }
    ];
    
    const campaigns = await this.CampaignModel.aggregate(pipeline).exec();
    if (campaigns && campaigns.length > 0 && campaigns[0].leads) {
    const lead = campaigns[0].leads;
    const subject = campaigns[0].template.emails.subject;
    const description = campaigns[0].template.emails.description;
    const followup = campaigns[0].template.emails.scheduledFollowups[0];

    const scheduler = campaigns[0].scheduler;
    const senderIds = campaigns[0].scheduler.senderIds.selectedSenders;
    await this.scheduleEmail(subject, description, scheduler, lead);
   return campaigns  
  } else {
    console.log("No campaigns with active leads found");
  }
  }

  scheduleEmail(subject: string, description: string, scheduler:any, lead:any) {
 
    const rampUpCount = parseInt(scheduler.rampUpCount, 10);
    const leads = lead;


    const startTimeParts = scheduler.startTime.split(':');
    const startHour = parseInt(startTimeParts[0], 10);
    const startMinute = parseInt(startTimeParts[1], 10);

    const scheduledDate = new Date(); 
    scheduledDate.setHours(startHour, startMinute, 0, 0);

    const rule = new schedule.RecurrenceRule();
    rule.hour = { start: startHour, end: 23, step: rampUpCount };
    rule.minute = startMinute;

    const job = schedule.scheduleJob(scheduledDate, () => {
      for (const lead of leads) {
        console.log(`Name: ${lead.name}, Email: ${lead.email}`);
        try {
          this.sendMail(lead.email, subject, description);
          console.log('Email sent successfully!');
        } catch (error) {
          console.error('Error sending email:', error);
        }
       
      }
    });

    console.log(`Job scheduled at: ${scheduledDate}`);
  }

}
