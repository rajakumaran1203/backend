import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
// import { ScheduleService } from './schedule.service';
import * as cors from 'cors';

async function bootstrap() {
  const logger = new Logger('bootstarp');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
  //   origin: 'https://master--friendly-halva-89d6cc.netlify.app/',
  //   credentials: true,
  // });

  const allowedOrigins = ['https://master--friendly-halva-89d6cc.netlify.app'];
      app.use(cors({
        origin: allowedOrigins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      }));
  const port = 3000;
  // const scheduleService = app.get(ScheduleService);
  // scheduleService.scheduleEmailTask();
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();



