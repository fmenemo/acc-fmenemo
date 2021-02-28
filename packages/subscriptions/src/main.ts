import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const port = parseInt(process.env.PORT ?? '3001', 10) || 3001;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      port,
      host: 'acc-fmenemo-subscriptions',
    },
  });

  app.listen(() => console.log(`| --- Subscriptions microservice listening on port: ${port} --- |`));
}

bootstrap();
