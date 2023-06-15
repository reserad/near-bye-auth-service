import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AxiosExceptionFilter(httpAdapter));
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api');

  await app.listen(3002, '0.0.0.0');
}
bootstrap();
