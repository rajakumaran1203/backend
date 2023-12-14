import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailController,EmailListController } from './email.controller';
import { EmailService } from './email.service';
import { EmailSchema } from './email.schema';
import { UserModel } from './user.model';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Email', schema: EmailSchema }]),
  MongooseModule.forFeature([{ name: 'User', schema: UserModel }]),],
  controllers: [EmailController,EmailListController],
  providers: [EmailService],
})
export class EmailModule {}


