import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable cors
  app.enableCors({ origin: 'http://localhost:4200' });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Millennium Falcon API')
    .setDescription('The Millennium Falcon API computing the odd mission')
    .setVersion('1.0')
    .addTag('')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Pipes
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
