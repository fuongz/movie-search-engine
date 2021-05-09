import { HttpService, Injectable } from '@nestjs/common';

import cheerio from 'cheerio';

@Injectable()
export class GotService {
  constructor(private httpService: HttpService) {}

  private gotOptions: any = {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.3',
      'Upgrade-Insecure-Requests': 1,
    },
    timeout: 5000,
    retries: 0,
  };

  /**
   * HTTP Request
   * @param url string
   * @returns number
   */
  async get(url: string): Promise<any> {
    const res = await this.httpService.get(url, this.gotOptions).toPromise();
    return cheerio.load(res.data);
  }
}
