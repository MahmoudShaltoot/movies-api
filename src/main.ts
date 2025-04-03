import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Movie API')
    .setDescription('Sync tmdb data')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 8080);

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
