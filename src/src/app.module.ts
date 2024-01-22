import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TemplateModule} from './template/template.module';
import {EmailModule} from './email_campaign/email.module';
import {GraphModule} from './graph/graph.module';
import {UserModule} from './user/user.module';
import {EmailInboxModule} from './email_inbox/email.module';
import {CsvModule} from './upload_file/csv.module';
import { CampaignModule } from './email_campaign1/campaign.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    CampaignModule,
    CsvModule,
    EmailInboxModule,
    UserModule,
    TemplateModule,
    EmailModule,
    GraphModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
