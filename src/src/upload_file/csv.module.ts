import { Module } from '@nestjs/common';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { CsvRecord, CsvRecordSchema } from './csv-record.schema';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    MongooseModule.forFeature([{ name: CsvRecord.name, schema: CsvRecordSchema }]),
  ],
  controllers: [CsvController],
  providers: [CsvService],
})
export class CsvModule {}
