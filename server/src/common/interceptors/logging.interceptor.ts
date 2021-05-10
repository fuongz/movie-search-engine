import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const { url, method } = context.switchToHttp().getRequest();
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `> [${new Date().toLocaleString('vi-VN')}] ${method}: ${url} - ${
              Date.now() - now
            }ms`,
          ),
        ),
      );
  }
}
