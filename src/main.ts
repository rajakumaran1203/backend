import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
// import { ScheduleService } from './schedule.service';

async function bootstrap() {
  const logger = new Logger('bootstarp');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
  const port = 3000;
  // const scheduleService = app.get(ScheduleService);
  // scheduleService.scheduleEmailTask();
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();



