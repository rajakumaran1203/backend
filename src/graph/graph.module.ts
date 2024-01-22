// user.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './graph.controller';
import { UserService } from './graph.service';
import { User, UserSchema } from './graph.model';
import { EmailCountSchema } from '../email_inbox/email-count.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
  MongooseModule.forFeature([{ name: 'EmailCount', schema: EmailCountSchema }])],
  controllers: [UserController],
  providers: [UserService],
})
export class GraphModule {}
