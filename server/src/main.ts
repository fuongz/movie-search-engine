import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3000', 'https://phim.phake.dev'],
    },
  });
  app.use(helmet());
  await app.listen(process.env.PORT);
}
bootstrap();
