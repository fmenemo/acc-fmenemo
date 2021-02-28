import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const port = parseInt(process.env.PORT ?? '3000', 10) || 3000;
  const env = (process.env.NODE_ENV || '').toUpperCase();

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Backend')
    .setDescription('The backend exposed APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // docs.nestjs.com/pipes#the-built-in-validationpipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // disableErrorMessages: environment.production,
      validationError: {
        target: false,
      },
    }),
  );
  _initCors(app);

  await app.listen(port).then(() => {
    console.log(`| --- ${env} server listening on: ${'http://localhost:'}${port}  --- |`);
  });
}

function _initCors(app: INestApplication) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  app.use(
    (
      req: { method: string; headers: { origin: any }; hostname: string },
      res: {
        header: (arg0: string, arg1: any) => void;
        setHeader: (arg0: string, arg1: string | boolean) => void;
        statusCode: number;
        end: () => void;
      },
      next: () => void,
    ) => {
      const method = req?.method?.toUpperCase();
      res.header('Access-Control-Allow-Origin', req?.headers?.origin);
      res.setHeader('Cache-Control', 'no-cache, no-store');
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token, A360session');

      if (method === 'OPTIONS') {
        res.statusCode = 204;
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATH');
        res.setHeader('Content-Length', '0');
        res.end();
      } else {
        next();
      }
    },
  );
}

bootstrap();
