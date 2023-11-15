import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailController } from './email/email.controller';
import { EmailService } from './email/email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSchema } from './email/email.schema';


@Module({
  imports: [    
    MongooseModule.forRoot('mongodb://localhost:27017/email_data',),
    MongooseModule.forFeature([{ name: 'Email', schema: EmailSchema }]),
],
  controllers: [AppController, EmailController],
  providers: [AppService, EmailService],
})
export class AppModule {}
