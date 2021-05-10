import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from 'src/common/interceptors';
import { MoviesService } from './movies.service';

@Controller('/')
@UseInterceptors(LoggingInterceptor)
export class MoviesController {
  constructor(private moviesServices: MoviesService) {}

  @Get()
  findAll(@Query('q') q: string): any {
    if (!q)
      throw new HttpException(
        {
          error: 'Vui lòng nhập từ khóa muốn tìm kiếm.',
        },
        HttpStatus.NOT_FOUND,
      );
    return this.moviesServices
      .search(q)
      .then((e) =>
        e.filter((e: any) => typeof e !== 'undefined' && e.cdn !== null),
      );
  }
}
