import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Allow cross-origin requests for frontend
  await app.listen(process.env.PORT ?? 12345, '0.0.0.0');
}
bootstrap();
