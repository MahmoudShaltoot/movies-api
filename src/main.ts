import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RmqOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT ?? 3000);

  const RABBITMQ_URL = process.env.RABBITMQ_URL;
  const mqService = await NestFactory.createMicroservice(AppModule, <RmqOptions>{
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: 'movies_queue',
      noAck: false
    },
  });

  mqService.listen();
}
bootstrap();
