// import { Injectable } from '@nestjs/common';
// import * as csvParser from 'csv-parser';
// import { createReadStream } from 'fs';
// import { CsvRecordDto } from './dto/csv-record.dto';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { MongoError } from 'mongodb';

// @Injectable()
// export class CsvService {
//   constructor(@InjectModel('CsvRecord') private readonly csvRecordModel: Model<CsvRecordDto>) {}

//   async processCsv(filePath: string): Promise<CsvRecordDto[]> {
//     const records: CsvRecordDto[] = [];
//     const errors: string[] = [];

//     return new Promise((resolve, reject) => {
//       const readableStream = createReadStream(filePath);

//       readableStream
//         .pipe(csvParser())
//         .on('data', async (data: any) => {
//           const record: CsvRecordDto = {
//             name: data.name, 
//             email: data.email,
//           };

//           try {
//             if (await this.isValidEmail(record.email)) {
//               await this.csvRecordModel.create(record);
//               records.push(record);
//             }
//           } catch (error) {
//             if (error instanceof MongoError && error.code === 11000) {
//               const duplicateEmail = /email: "(.*?)"/.exec(error.message);
//               const errorMessage = `Duplicate email found: ${duplicateEmail ? duplicateEmail[1] : 'Unknown'}`;
//               errors.push(errorMessage);
//             } else {
//               console.error('Error during CSV record processing:', error);
//               errors.push(error.message || 'Unknown error');
//             }
//           }
//         })
//         .on('end', () => {
//           if (errors.length > 0) {
//             reject(new Error(`Errors occurred during CSV processing: ${errors.join(', ')}`));
//           } else {
//             resolve(records);
//           }
//         })
//         .on('error', (error) => {
//           console.error('Error during CSV processing:', error);
//           reject(error);
//         });
//     });
//   }

//   private async isValidEmail(email: string): Promise<boolean> {
//     const existingRecord = await this.csvRecordModel.findOne({ email }).exec();
//     return !existingRecord;
//   }
// }


import { Injectable } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import { createReadStream } from 'fs';
import { CsvRecordDto } from './dto/csv-record.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoError } from 'mongodb';


@Injectable()
export class CsvService {
  constructor(@InjectModel('CsvRecord') private readonly csvRecordModel: Model<CsvRecordDto>) {}

  async processCsv(filePath: string): Promise<CsvRecordDto[]> {
    const records: CsvRecordDto[] = [];
    const errors: string[] = [];

    return new Promise((resolve, reject) => {
      const readableStream = createReadStream(filePath);

      readableStream
        .pipe(csvParser())
        .on('data', async (data: any) => {
          const record: CsvRecordDto = {
            name: data.name, 
            email: data.email,
            isActive: true,
          };

          try {
            if (await this.isValidEmail(record.email)) {
              await this.csvRecordModel.create(record);
              records.push(record);
            }
          } catch (error) {
            if (error instanceof MongoError && error.code === 11000) {
              const duplicateEmail = /email: "(.*?)"/.exec(error.message);
              const errorMessage = `Duplicate email found: ${duplicateEmail ? duplicateEmail[1] : 'Unknown'}`;
              errors.push(errorMessage);
            } else {
              console.error('Error during CSV record processing:', error);
              errors.push(error.message || 'Unknown error');
            }
          }
        })
        .on('end', () => {
          if (errors.length > 0) {
            reject(new Error(`Errors occurred during CSV processing: ${errors.join(', ')}`));
          } else {
            resolve(records);
          }
        })
        .on('error', (error) => {
          console.error('Error during CSV processing:', error);
          reject(error);
        });
    });
  }

  private async isValidEmail(email: string): Promise<boolean> {
    const existingRecord = await this.csvRecordModel.findOne({ email }).exec();
    return !existingRecord;
  }
    async getData(): Promise<{ count: number; records: CsvRecordDto[] }> {
    const records = await this.csvRecordModel.find().exec();
    const count = await this.csvRecordModel.countDocuments().exec();
    return { count, records };
  }
  // async getData(): Promise<CsvRecordDto[]> {
  //   return this.csvRecordModel.find().exec();
  // }
}
