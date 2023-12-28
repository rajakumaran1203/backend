import { Module } from '@nestjs/common';
import { EmailInboxService } from './email.service';
import {EmailInboxController} from './email.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailCountSchema } from './email-count.model';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'EmailCount', schema: EmailCountSchema }])],
  controllers: [EmailInboxController],
  providers: [EmailInboxService],
})
export class EmailInboxModule {}
