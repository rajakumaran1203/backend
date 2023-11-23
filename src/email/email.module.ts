import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailSchema } from './email.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Email', schema: EmailSchema }])],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}


