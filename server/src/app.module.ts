import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GotService } from './got.service';
import { MoviesService } from './movies.service';
import { StringService } from './string.service';

import { MoviesController } from './movies.controller';
import configuration from './../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    HttpModule,
  ],
  controllers: [AppController, MoviesController],
  providers: [AppService, MoviesService, StringService, GotService],
})
export class AppModule {}
