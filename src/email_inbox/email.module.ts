import { Module } from '@nestjs/common';
import { EmailInboxService } from './email.service';
import {EmailInboxController} from './email.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailCountSchema } from './email-count.model';
import {EmailCredentials, EmailCredentialsSchema} from './user_details';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'EmailCount', schema: EmailCountSchema }]),
  MongooseModule.forFeature([{ name: 'EmailCredentials', schema: EmailCredentialsSchema }]),],
  controllers: [EmailInboxController],
  providers: [EmailInboxService],
})
export class EmailInboxModule {}
