import {
  AuthUser,
  createClient,
  SupabaseClient,
  SupabaseClientOptions,
} from '@supabase/supabase-js';
import { Request } from 'express';
import { JwtFromRequestFunction } from 'passport-jwt';
import { Strategy } from 'passport-strategy';
import RequestWithUser from 'src/app/auth/requestWithUser.interface';
import { SUPABASE_AUTH, UNAUTHORIZED } from 'src/constants';

export interface SupabaseAuthStrategyOptions {
  supabaseUrl: string;
  supabaseKey: string;
  supabaseOptions: SupabaseClientOptions;
  extractor: JwtFromRequestFunction;
}

export class SupabaseAuthStrategy extends Strategy {
  readonly name = SUPABASE_AUTH;
  private supabase: SupabaseClient;
  private extractor: JwtFromRequestFunction;

  success: (user: any, info: any) => void;
  fail: Strategy['fail'];

  constructor(options: SupabaseAuthStrategyOptions) {
    super();
    if (!options.extractor) {
      throw new Error(
        '\n Extractor is not a function. You should provide an extractor. \n Read the docs: https://github.com/tfarras/nestjs-firebase-auth#readme',
      );
    }

    this.supabase = createClient(
      options.supabaseUrl,
      options.supabaseKey,
      (options.supabaseOptions = {}),
    );
    this.extractor = options.extractor;
  }

  async validate(payload: AuthUser): Promise<AuthUser> {
    return payload;
  }

  authenticate(req: Request): void {
    const idToken = this.extractor(req);

    if (!idToken) {
      this.fail(UNAUTHORIZED, 401);
      return;
    }

    this.supabase.auth.api
      .getUser(idToken)
      .then((res) => this.validateSupabaseReponse(res))
      .catch((err) => this.fail(err.message, 401));
  }

  public signin(credentials: any) {
    return new Promise(async (resolve, reject) => {
      const { session, error } = await this.supabase.auth.signIn(credentials);
      if (error) {
        return reject(error);
      }
      return resolve(session);
    });
  }

  public me(req: RequestWithUser) {
    return new Promise(async (resolve, reject) => {
      const idToken = this.extractor(req);
      const { user, error } = await this.supabase.auth.api.getUser(idToken);
      if (error) {
        return reject(error);
      }
      return resolve(user);
    });
  }

  public signout(req: RequestWithUser) {
    return new Promise(async (resolve, reject) => {
      const { error } = await this.supabase.auth.api.signOut(
        this.extractor(req),
      );
      if (error) {
        return reject(error);
      }
      return resolve('Đăng xuất thành công');
    });
  }

  private async validateSupabaseReponse({ data }: any) {
    const result = await this.validate(data);
    if (result) {
      this.success(result, {});
      return;
    }
    this.fail(UNAUTHORIZED, 401);
    return;
  }
}
