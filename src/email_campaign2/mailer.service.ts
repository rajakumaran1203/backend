// // mailer.service.ts
// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';
// import { Model } from 'mongoose';
// import { EmailCredentials } from './user_details';
// import { InjectModel } from '@nestjs/mongoose';

// @Injectable()
// export class MailerService {
//   // private transporter;
//   private transporter: nodemailer.Transporter[];

//   constructor(@InjectModel('EmailCredential') private readonly emailCredentialModel: Model<EmailCredentials>) {
//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'rajakumarandevloper@gmail.com',
//         pass: 'grmwpcokgoqgamht',
//       },
//     });
//   }

//   async sendMail(to: string, subject: string, text: string) {
//     // const emailCredentials = await this.getEmailCredentials();
//     const mailOptions = {
//       from: "emailCredentials.user",
//       to,
//       subject,
//       text,
//     };

//     await transporter.sendMail(mailOptions);
//   }
//   // async getEmailCredentials() {
//   //   // Fetch email credentials from the collection
//   //   const emailCredentials = await this.emailCredentialModel.findOne().exec();
//   //   return emailCredentials;
//   // }

//   // async maildata(){

//   // }

// }

// mailer.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Model } from 'mongoose';
import { EmailCredentials } from './user_details';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MailerService {
  private transporters: nodemailer.Transporter[];
  private readonly logger = new Logger(MailerService.name);

  constructor(@InjectModel('EmailCredential') private readonly emailCredentialModel: Model<EmailCredentials>) {
    // Assuming you have multiple transporters in the array
    // const emailCredentials = this.getEmailCredentials();
    // this.transporter = [
    //   nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: emailCredentials.user,
    //       pass: emailCredentialModel.password,
    //     },
    //   }),
    //   // Add other transporters as needed
    // ];
    this.setupTransporters();
  }

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

    // Send mail using the selected transporter
    await transporter.sendMail(mailOptions);
  // }
}

  async getEmailCredentials() {
        // Fetch email credentials from the collection
        const emailCredentials = await this.emailCredentialModel.findOne().exec();
        return emailCredentials;
      }

}
