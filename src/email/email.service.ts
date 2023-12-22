
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
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: "rajakumarandevloper@gmail.com",
        clientId: "828057784769-aplbedrfjfqqo8tnuoohdsdfl7te33ip.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken: "1//04megLYWIry7xCgYIARAAGAQSNwF-L9IrF6hwiOQqV8f7E3ccOvv8lhUp4XaRTQpwZo_AY_VIuzJgytz6_IoH-sNM5ckmUxTo1vc",
        accessToken: "ya29.a0AfB_byBxBaWLqydpG-sW7L3yD2cMkXTF4E61QxFVWlzQ1wHnwxDeh1FlLCcEsJgMozacJ9Mp-_fEYism4JIGoAtpyi1xJ5WAwBoSfLABplAVtl7SDvS6L6r3-UI20f0C3Qw71XN3lVvUR0AY-RJ5Bm34K2PYl-Fm3bBDaCgYKAawSARASFQHGX2Mi9zo0rK3btsfKGGYYKf8gDA0171",
        expires: 3599,
      },  
    });
  }
  

  async sendEmail(to: string[], subject: string, text: string): Promise<void> {
    for (const recipient of to) {
      const mailOptions = {
        from: "rajakumarandevloper@gmail.com",
        to: recipient,
        subject,
        text,
      };

      try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log('Email sent:', info);

        const email = new this.emailModel({
          from: "rajakumarandevloper@gmail.com",
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
