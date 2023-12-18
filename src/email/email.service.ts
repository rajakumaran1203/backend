
import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email } from './email.schema';
import { User } from './user.model';

@Injectable()
export class EmailService {
  private transporter;

  constructor(
    @InjectModel('Email') private readonly emailModel: Model<Email>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.transporter = nodemailer.createTransport({
      // Configure your email provider here
      service: 'gmail',
      auth: {
        user: '@gmail.com',
        pass: '',
      },
    });

    // Register the sentMail event listener
    this.transporter.on('sentMail', async (info) => {
      console.log('Email sent:', info.response);

      // Handle the removal based on the email response
      if (info.response && info.response.includes('550 5.1.1')) {
        console.error(`Email to ${info.envelope.to} does not exist. Deleting user account.`);

        // Remove the user account from MongoDB based on the email address
        await this.userModel.deleteOne({ email: info.envelope.to }).exec();
      }

      // Remove the email from MongoDB
      await this.emailModel.deleteMany({ to: [info.envelope.to], sentAt: new Date() }).exec();
    });
  }

  async sendEmail(to: string[], subject: string, text: string): Promise<void> {
    for (const recipient of to) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject,
        text,
      };

      try {
        // Send email using nodemailer for each recipient
        await this.transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipient}:`, info.response);
        const email = new this.emailModel({
          from: process.env.EMAIL_USER,
          to: [recipient],
          subject,
          text,
          sentAt: new Date(),
        });
        await email.save();

      } catch (error) {
        console.error(`Error sending email to ${recipient}:`, error);
      }
    }
  }

  async findAll(): Promise<Email[]> {
    return this.emailModel.find().exec();
  }

  async getEmails(): Promise<{ value: string; label: string }[]> {
    const users = await this.userModel.find({}, 'email').exec();
    const emails = users.map(user => user.email);
    return emails.map(email => ({ value: email, label: email }));
  }
}
