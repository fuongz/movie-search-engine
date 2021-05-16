import { Inject, Injectable } from '@nestjs/common';
import { Configuration } from './configuration';

import * as mailgunJs from 'mailgun-js';
import { MailgunModel } from './mailgun.model';

export interface EmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  attachment?;
  'h:X-Mailgun-Variables'?: string;
}

@Injectable()
export class MailgunService {
  private readonly mailgun: any;

  constructor(
    @Inject('MAILGUN_CONFIGURATION')
    private readonly configuration: Configuration,
  ) {
    this.mailgun = mailgunJs({
      apiKey: configuration.API_KEY,
      domain: configuration.DOMAIN,
      publicApiKey: configuration.PUBLIC_API_KEY,
      host: configuration.HOST,
    });
  }

  public sendEmail(emailOptions: EmailOptions | MailgunModel): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mailgun.messages().send(emailOptions, (error: any, body: any) => {
        if (error) {
          return reject(error);
        }
        return resolve(body);
      });
    });
  }
}
