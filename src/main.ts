import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstarp');
  const app = await NestFactory.create(AppModule);
  
  //TO Enable CORS for routes
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  const port = 3001;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
