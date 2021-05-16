import { Global, HttpModule, Module } from '@nestjs/common';
import { GotHelper, StringHelper } from './helpers';

@Global()
@Module({
  imports: [HttpModule],
  providers: [GotHelper, StringHelper],
  exports: [HttpModule, GotHelper, StringHelper],
})
export class CommonModule {}
