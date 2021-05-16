import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_KEY'),
    );
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

  public signup(formData: any) {
    return new Promise(async (resolve, reject) => {
      const { session, error } = await this.supabase.auth.signIn(formData);
      if (error) {
        return reject(error);
      }
      return resolve(session);
    });
  }

  public signout() {
    return new Promise(async (resolve, reject) => {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        return reject(error);
      }
      return resolve({});
    });
  }

  public me(authorization: string) {
    return new Promise(async (resolve, reject) => {
      const jwt = authorization.replace(/^Bearer\s/, '');
      const { user, error } = await this.supabase.auth.api.getUser(jwt);
      if (error) {
        return reject(error);
      }
      return resolve(user);
    });
  }

  public resetPassword(email: string) {
    return new Promise(async (resolve, reject) => {
      const { data, error } =
        await this.supabase.auth.api.resetPasswordForEmail(email);
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  }
}
