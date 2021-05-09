import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GotService } from './got.service';
import { MoviesService } from './movies.service';
import { StringService } from './string.service';

import { MoviesController } from './movies.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppController, MoviesController],
  providers: [AppService, MoviesService, StringService, GotService],
})
export class AppModule {}
