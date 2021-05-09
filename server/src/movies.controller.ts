import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesServices: MoviesService) {}

  @Get()
  findAll(@Query('q') q: string): any {
    return this.moviesServices
      .search(q)
      .then((e) =>
        e.filter((e: any) => typeof e !== 'undefined' && e.cdn !== null),
      );
  }
}
