import { Module } from '@nestjs/common';
import { GotHelper, StringHelper } from 'src/common/helpers';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [GotHelper, StringHelper],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
