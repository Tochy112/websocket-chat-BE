import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle(process.env.APP_NAME || 'API')
    .setDescription(process.env.APP_DESCRIPTION || 'API Documentation')
    .setVersion(process.env.API_VERSION || '1.0')
    .addServer('/api/v1')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: false,
  });

  app.enableCors();

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api/');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  try {
    SwaggerModule.setup('/api', app, document, {
      swaggerOptions: {
        useGlobalPrefix: true,
      },
    });
  } catch (error) {
    console.error('Error setting up Swagger:', error);
  }

  await app.listen(process.env.PORT || 5000);
  const url = await app.getUrl();
  console.log(`Application is running on: ${url}`);
}

bootstrap();
