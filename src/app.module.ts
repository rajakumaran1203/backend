import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {TemplateModule} from './template/template.module';
import {EmailModule} from './email/email.module';
import {GraphModule} from './graph/graph.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    TemplateModule,
    EmailModule,
    GraphModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
