import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import { emailConfig } from "./email.config";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email } from './email.schema';

@Injectable()
export class EmailService {
    private transporter;

    constructor(@InjectModel('Email') private readonly emailModel: Model<Email>) {
        this.transporter = nodemailer.createTransport({
          // Configure your email provider here
          service: 'gmail',
          auth: {
            user: 'rajakumarandevloper@gmail.com',
            pass: 'grmwpcokgoqgamht',
          },
        });
      }

    async sendEmail(to: string, subject: string, text: string ) : Promise<void> {
        const mailOptions = {
            from:process.env.EMAIL_USER,
            to,
            subject,
            text,
        }
        try {
            // Send email using nodemailer
            const info = await this.transporter.sendMail(mailOptions);
      
            console.log('Email sent:', info.response);
      
            // Save email information to MongoDB
            const email = new this.emailModel({
              to,
              subject,
              text,
              sentAt: new Date(),
            });
      
            await email.save();
          } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
          }

        await this.transporter.sendMail(mailOptions , (err : any ,info: any)=> {
            if(err){
                console.log(err)
                return;
            }
            console.log(info.response)
        })
    }
}