// import { Injectable } from '@nestjs/common';
// import { inspect } from 'util';
// import * as Imap from 'node-imap';

// @Injectable()
// export class EmailInboxService {
//   private imap: any;

//   constructor() {
//     this.imap = new Imap({
//       user: 'rajakumarandevloper@gmail.com',
//       password: 'grmwpcokgoqgamht',
//       host: 'imap.gmail.com',
//       port: 993,
//       tls: true,
//     });
//   }

//   public async fetchEmails(): Promise<any[]> {
//     return new Promise<any[]>((resolve, reject) => {
//       const emails: any[] = []; // Array to store email data

//       this.imap.once('ready', () => {
//         this.openInbox((err, box) => {
//           if (err) {
//             reject(err);
//           } else {
//             const f = this.imap.seq.fetch('1:*', {
//               bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
//               struct: true,
//             });

//             f.on('message', (msg, seqno) => {
//               console.log('Message #%d', seqno);
//               const prefix = '(#' + seqno + ') ';

//               const email: any = {}; // Object to store email details

//               msg.on('body', (stream, info) => {
//                 let buffer = '';
//                 stream.on('data', (chunk) => {
//                   buffer += chunk.toString('utf8');
//                 });
//                 stream.once('end', () => {
//                   email.header = inspect(Imap.parseHeader(buffer));
//                 });
//               });

//               msg.once('attributes', (attrs) => {
//                 email.attributes = attrs;
//               });

//               msg.once('end', () => {
//                 console.log(prefix + 'Finished');
//                 emails.push(email); // Add the email to the array
//               });
//             });

//             f.once('error', (fetchErr) => {
//               reject(fetchErr);
//             });

//             f.once('end', () => {
//               console.log('Done fetching all messages!');
//               this.imap.end();
//               resolve(emails); // Resolve the promise with the array of emails
//             });
//           }
//         });
//       });

//       this.imap.once('error', (err) => {
//         reject(err);
//       });

//       this.imap.once('end', () => {
//         console.log('Connection ended');
//       });

//       this.imap.connect();
//     });
//   }

//   private openInbox(cb: (err: any, box: any) => void): void {
//     this.imap.openBox('INBOX', true, cb);
//   }
// }


// import { Injectable } from '@nestjs/common';
// import { inspect } from 'util';
// import * as Imap from 'node-imap';

// @Injectable()
// export class EmailInboxService {
//   private imap: any;
//   private successCount: number;
//   private failureCount: number;

//   constructor() {
//     this.imap = new Imap({
//       user: 'rajakumarandevloper@gmail.com',
//       password: 'grmwpcokgoqgamht',
//       host: 'imap.gmail.com',
//       port: 993,
//       tls: true,
//     });

//     this.successCount = 0;
//     this.failureCount = 0;
//   }

//   public async fetchEmails(): Promise<any[]> {
//     return new Promise<any[]>((resolve, reject) => {
//       const emails: any[] = []; // Array to store email data

//       this.imap.once('ready', () => {
//         this.openInbox((err, box) => {
//           if (err) {
//             reject(err);
//           } else {
//             const f = this.imap.seq.fetch('1:*', {
//               bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
//               struct: true,
//             });

//             f.on('message', (msg, seqno) => {
//               console.log('Message #%d', seqno);
//               const prefix = '(#' + seqno + ') ';

//               const email: any = {}; // Object to store email details

//               msg.on('body', (stream, info) => {
//                 let buffer = '';
//                 stream.on('data', (chunk) => {
//                   buffer += chunk.toString('utf8');
//                 });
//                 stream.once('end', () => {
//                   email.header = inspect(Imap.parseHeader(buffer));
//                 });
//               });

//               msg.once('attributes', (attrs) => {
//                 email.attributes = attrs;
//               });

//               msg.once('end', () => {
//                 console.log(prefix + 'Finished');
//                 emails.push(email); // Add the email to the array
//                 this.successCount++; // Increment the success count
//               });
//             });

//             f.once('error', (fetchErr) => {
//               reject(fetchErr);
//               this.failureCount++; // Increment the failure count
//             });

//             f.once('end', () => {
//               console.log('Done fetching all messages!');
//               this.imap.end();
//               console.log(`Success Count: ${this.successCount}`);
//               console.log(`Failure Count: ${this.failureCount}`);
//               resolve(emails); // Resolve the promise with the array of emails
//             });
//           }
//         });
//       });

//       this.imap.once('error', (err) => {
//         reject(err);
//         this.failureCount++; // Increment the failure count
//       });

//       this.imap.once('end', () => {
//         console.log('Connection ended');
//       });

//       this.imap.connect();
//     });
//   }

//   private openInbox(cb: (err: any, box: any) => void): void {
//     this.imap.openBox('INBOX', true, cb);
//   }
// }


// import { Injectable } from '@nestjs/common';
// import { inspect } from 'util';
// import * as Imap from 'node-imap';

// @Injectable()
// export class EmailInboxService {
//   private imap: any;
//   private successCount: number = 0;
//   private failureCount: number = 0;

//   constructor() {
//     this.imap = new Imap({
//       user: 'rajakumarandevloper@gmail.com',
//       password: 'grmwpcokgoqgamht',
//       host: 'imap.gmail.com',
//       port: 993,
//       tls: true,
//     });
//   }

//   public async fetchEmails(): Promise<any[]> {
//     return new Promise<any[]>((resolve, reject) => {
//       const emails: any[] = [];

//       this.imap.once('ready', () => {
//         this.openInbox((err, box) => {
//           if (err) {
//             reject(err);
//           } else {
//             const f = this.imap.seq.fetch('2:*', {
//               bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
//               struct: true,
//             });

//             f.on('message', (msg, seqno) => {
//               console.log('Message #%d', seqno);
//               const prefix = '(#' + seqno + ') ';

//               const email: any = {};

//               msg.on('body', (stream, info) => {
//                 let buffer = '';
//                 stream.on('data', (chunk) => {
//                   buffer += chunk.toString('utf8');
//                 });
//                 stream.once('end', () => {
//                   email.header = inspect(Imap.parseHeader(buffer));
//                 });
//               });

//               msg.once('attributes', (attrs) => {
//                 email.attributes = attrs;
//               });

//               msg.once('end', () => {
//                 console.log(prefix + 'Finished');
//                 emails.push(email);

//                 this.successCount++;
//               });
//             });

//             f.once('error', (fetchErr) => {
//               reject(fetchErr);

//               // Increment failure count
//               this.failureCount++;
//             });

//             f.once('end', () => {
//               console.log('Done fetching all messages!');
//               this.imap.end();
//               resolve(emails);
//             });
//           }
//         });
//       });

//       this.imap.once('error', (err) => {
//         reject(err);

//         // Increment failure count
//         // this.failureCount++;
//       });

//       this.imap.once('end', () => {
//         console.log('Connection ended');
//       });

//       this.imap.connect();
//     });
//   }

//   private openInbox(cb: (err: any, box: any) => void): void {
//     this.imap.openBox('INBOX', true, cb);
//   }

//   getStats(): { successCount: number; failureCount: number } {
//     return {
//       successCount: this.failureCount,
//       failureCount: this.successCount,
//     };
//   }
// }


// import { Injectable } from '@nestjs/common';
// import { inspect } from 'util';
// import * as Imap from 'node-imap';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { EmailCount } from './email-count.model';

// @Injectable()
// export class EmailInboxService {
//   private imap: any;
//   private successCount: number = 0;
//   private failureCount: number = 0;
//   constructor(@InjectModel(EmailCount.name) private readonly emailCountModel: Model<EmailCount>) {
//     this.imap = new Imap({
//       user: 'rajakumarandevloper@gmail.com',
//       password: 'grmwpcokgoqgamht',
//       host: 'imap.gmail.com',
//       port: 993,
//       tls: true,
//     });
//   }

//   public async fetchEmails(): Promise<any[]> {
//     return new Promise<any[]>((resolve, reject) => {
//       const emails: any[] = [];

//       this.imap.once('ready', () => {
//         this.openInbox((err, box) => {
//           if (err) {
//             reject(err);
//           } else {
//             const f = this.imap.seq.fetch('*:*', {
//               bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
//               struct: true,
//             });

//             f.on('message', (msg, seqno) => {
//               console.log('Message #%d', seqno);
//               const prefix = '(#' + seqno + ') ';

//               const email: any = {};

//               msg.on('body', (stream, info) => {
//                 let buffer = '';
//                 stream.on('data', (chunk) => {
//                   buffer += chunk.toString('utf8');
//                 });
//                 stream.once('end', () => {
//                   // email.header = inspect(Imap.parseHeader(buffer));
//                   const headers = Imap.parseHeader(buffer);
//                   const fromAddress = headers['from'] && headers['from'].length > 0 ? headers['from'][0] : '';
//                   email.sender = fromAddress;
//                   email.header = inspect(headers);

//                 });
//               });

//               msg.once('attributes', (attrs) => {
//                 email.attributes = attrs;
//               });

//               msg.once('end', () => {
//                 console.log(prefix + 'Finished');
//                 emails.push(email);
//                 this.updateCount('successCount');
//               });
//             });

//             f.once('error', (fetchErr) => {
//               reject(fetchErr);
//               this.updateCount('failureCount');
//             });

//             f.once('end', () => {
//               console.log('Done fetching all messages!');
//               this.imap.end();
//               resolve(emails);
//             });
//           }
//         });
//       });

//       this.imap.once('error', (err) => {
//         reject(err);
//         this.updateCount('failureCount');
//       });

//       this.imap.once('end', () => {
//         console.log('Connection ended');
//       });

//       this.imap.connect();
//     });
//   }

//   private openInbox(cb: (err: any, box: any) => void): void {
//     this.imap.openBox('INBOX', true, cb);
//   }

//   private async updateCount(type: 'successCount' | 'failureCount'): Promise<void> {
//     try {
//       const count = await this.emailCountModel.findOne();
//       if (!count) {
//         const newCount = new this.emailCountModel({});
//         newCount[type] = 1;
//         await newCount.save();
//       } else {
//         count[type]++;
//         await count.save();
//       }
//     } catch (error) {
//       console.error('Error updating count:', error);
//     }
//   }
//   getStats(): { successCount: number; failureCount: number } {
//     return {
//       successCount: this.successCount,
//       failureCount: this.failureCount,
//     };
//   }
// }


// import { Injectable } from '@nestjs/common';
// import { inspect } from 'util';
// import * as Imap from 'node-imap';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { EmailCount } from './email-count.model';

// @Injectable()
// export class EmailInboxService {
//   private imap: any;
//   constructor(@InjectModel(EmailCount.name) private readonly emailCountModel: Model<EmailCount>) {
//     this.imap = new Imap({
//       user: 'rajakumarandevloper@gmail.com',
//       password: 'grmwpcokgoqgamht',
//       host: 'imap.gmail.com',
//       port: 993,
//       tls: true,
//     });
//   }

//   public async fetchEmails(): Promise<any[]> {
//     return new Promise<any[]>((resolve, reject) => {
//       const emails: any[] = [];

//       this.imap.once('ready', () => {
//         this.openInbox((err, box) => {
//           if (err) {
//             reject(err);
//           } else {
//             const totalMessages = box.messages.total;
//             const f = this.imap.seq.fetch('1:*', {
//               bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
//               struct: true,
//             });

//             f.on('message', (msg, seqno) => {
//               console.log('Message #%d', seqno);
//               const prefix = '(#' + seqno + ') ';

//               const email: any = {};

//               msg.on('body', (stream, info) => {
//                 let buffer = '';
//                 stream.on('data', (chunk) => {
//                   buffer += chunk.toString('utf8');
//                 });
//                 stream.once('end', () => {
//                   // email.header = inspect(Imap.parseHeader(buffer));
//                   const headers = Imap.parseHeader(buffer);
//                   const fromAddress = headers['from'] && headers['from'].length > 0 ? headers['from'][0] : '';
//                   email.sender = fromAddress;
//                   email.header = inspect(headers);
//                 });
//               });

//               msg.once('attributes', (attrs) => {
//                 email.attributes = attrs;
//               });

//               msg.once('end', () => {
//                 console.log(prefix + 'Finished');
//                 emails.push(email);
//               });
//             });

//             f.once('error', (fetchErr) => {
//               reject(fetchErr);
//             });

//             f.once('end', () => {
//               console.log('Done fetching all messages!');
//               this.imap.end();
//               const emailCount = emails.length;
//               resolve(emails);
//             });
//           }
//         });
//       });

//       this.imap.once('error', (err) => {
//         reject(err);
//       });

//       this.imap.once('end', () => {
//         console.log('Connection ended');
//       });

//       this.imap.connect();
//     });
//   }

//   private openInbox(cb: (err: any, box: any) => void): void {
//     this.imap.openBox('INBOX', true, cb);
//   }
// }


import { Injectable } from '@nestjs/common';
import { inspect } from 'util';
import * as Imap from 'node-imap';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailCount } from './email-count.model';

@Injectable()
export class EmailInboxService {
  private imap: any;

  constructor(@InjectModel(EmailCount.name) private readonly emailCountModel: Model<EmailCount>) {
    this.imap = new Imap({
      user: 'rajakumarandevloper@gmail.com',
      password: 'grmwpcokgoqgamht',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
    });
  }

  public async fetchEmails(): Promise<{ emails: any[]; totalMessages: number, failureCount: number }> {
    return new Promise<{ emails: any[]; totalMessages: number, failureCount: number }>(async (resolve, reject) => {
      const emails: any[] = [];
      let failureCount = 0;

      this.imap.once('ready', () => {
        this.openInbox((err, box) => {
          if (err) {
            reject(err);
          } else {
            const totalMessages = box.messages.total;
            const f = this.imap.seq.fetch('1:*', {
              bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
              struct: true,
            });

            f.on('message', (msg, seqno) => {
              console.log('Message #%d', seqno);
              const prefix = '(#' + seqno + ') ';

              const email: any = {};

              msg.on('body', (stream, info) => {
                let buffer = '';
                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });
                stream.once('end', () => {
                  const headers = Imap.parseHeader(buffer);
                  const fromAddress = headers['from'] && headers['from'].length > 0 ? headers['from'][0] : '';
                  email.sender = fromAddress;
                  email.header = inspect(headers);

                  const subjectArray = headers.subject || [];
                  const subjectString = subjectArray.join(', ');
                  const isFailure = subjectString.toLowerCase().includes('failure');
                  if (isFailure) {
                    failureCount++;
                  }
                });
              });

              msg.once('attributes', (attrs) => {
                email.attributes = attrs;
              });

              msg.once('end', () => {
                console.log(prefix + 'Finished');
                emails.push(email);
              });
            });

            f.once('error', (fetchErr) => {
              reject(fetchErr);
            });

            f.once('end', () => {
              console.log('Done fetching all messages!');
              this.imap.end();
              this.updateEmailStats('rajakumarandevloper@gmail.com', totalMessages, failureCount);
              resolve({ emails, totalMessages, failureCount });
            });
          }
        });
      });

      this.imap.once('error', (err) => {
        reject(err);
      });

      this.imap.once('end', () => {
        console.log('Connection ended');
      });

      this.imap.connect();
    });
  }

  private openInbox(cb: (err: any, box: any) => void): void {
    this.imap.openBox('INBOX', true, cb);
  }
  private async updateEmailStats(email: string, totalMessages: number, failureCount: number): Promise<void> {
    let emailCount = await this.emailCountModel.findOne({ email }).exec();

    if (!emailCount) {
      emailCount = new this.emailCountModel({ email, totalMessages, failureCount });
    } else {
      emailCount.totalMessages = totalMessages;
      emailCount.failureCount = failureCount;
    }

    await emailCount.save();
  } 
  async getAllEmailDetails(): Promise<EmailCount[]> {
    return this.emailCountModel.find().exec();
  }
}