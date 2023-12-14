// // email.service.ts
// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class EmailService {
//   private transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'rajakumarandevloper@gmail.com',
//         pass: 'grmwpcokgoqgamht',
//       },
//     });
//   }

//   async sendEmail(to: string, subject: string, text: string): Promise<void> {
//     const mailOptions = {
//       from: 'rajardevloper@gmail.com',
//       to,
//       subject,
//       text,
//     };

//     try {
//       await this.transporter.sendMail(mailOptions);
//       console.log('Email sent successfully');
//     } catch (error) {
//       console.error('Error sending email:', error);
//       throw error;
//     }
//   }
// }
