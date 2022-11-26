import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable cors
  app.enableCors();

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Falcon mission odds' API")
    .setDescription("The API aims to compute the odds for the Falcon's mission")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  await app.listen(3000);
}

bootstrap();
