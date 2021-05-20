import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

// Config
import configuration from './config/configuration';

// Modules
import { CommonModule } from './common/common.module';
import { MoviesModule } from './movies/movies.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './app/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),

    CommonModule,
    AuthModule,
    MoviesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
