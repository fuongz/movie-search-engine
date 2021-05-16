import { Module } from '@nestjs/common';
import { Configuration } from './configuration';
import { MailgunService } from './mailgun.service';

@Module({})
export class MailgunModule {
  public static forRoot(config: Configuration) {
    return {
      module: MailgunModule,
      providers: [
        {
          provide: 'MAILGUN_CONFIGURATION',
          useValue: config,
        },
        MailgunService,
      ],
      exports: [MailgunService],
    };
  }
}
