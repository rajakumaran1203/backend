import { Controller, Post, UploadedFile, UseInterceptors,Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvService } from './csv.service';
import { CsvRecordDto } from './dto/csv-record.dto';

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file): Promise<string | { error: string }> {
    try {
      const filePath = file.path;
      await this.csvService.processCsv(filePath);
      return 'File uploaded and processed successfully.';
    } catch (error) {
      if (error.message.startsWith('Duplicate email found:')) {
        return { error: error.message };
      } else {
        return { error: 'An error occurred during CSV processing.' };
      }
    }
  }
  // @Get('data')
  // async getData(): Promise<CsvRecordDto[]> {
  //   console.log("read");
  //   return this.csvService.getData();
  // }
  @Get('data')
  async getData(): Promise<{ count: number; records: CsvRecordDto[] }> {
    return this.csvService.getData();
  }
}

