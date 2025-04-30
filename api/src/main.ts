import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app)) 
  // app.use(
  //   session({
  //     secret: 'my-secret-key',
  //     resave: true,
  //     saveUninitialized: true,
  //     cookie: {
  //       maxAge: 1000, 
  //       httpOnly: true, 
  //     },
  //   }),
  // );
   app.enableCors({origin: ['http://localhost:8080', 'http://localhost:4200'],
    methods: 'GET,POST,PUT,DELETE', 
    allowedHeaders: 'Content-Type, Authorization', 
    credentials: true, 
  });

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('MessengerApp API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); 
  

  await app.listen(3000);
}
bootstrap();

