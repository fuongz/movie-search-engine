import { Global, HttpModule, Module } from '@nestjs/common';
import { GotHelper, StringHelper } from './helpers';
import { LoggingInterceptor } from './interceptors';

@Global()
@Module({
  imports: [HttpModule],
  providers: [HttpModule, GotHelper, StringHelper, LoggingInterceptor],
  exports: [HttpModule, GotHelper, StringHelper, LoggingInterceptor],
})
export class CommonModule {}
