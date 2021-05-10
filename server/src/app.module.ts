import { Module, HttpModule } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

// Config
import configuration from './config/configuration';

// Modules
import { CommonModule } from './common/common.module';
import { MoviesModule } from './movies/movies.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),

    HttpModule,
    CommonModule,

    MoviesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
