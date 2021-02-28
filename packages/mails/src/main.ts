import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const port = parseInt(process.env.PORT, 10) || 3002;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      port,
      host: 'acc-fmenemo-mails',
    },
  });

  app.listen(() => console.log(`| --- Mails microservice listening on port: ${port} --- |`));
}

bootstrap();
