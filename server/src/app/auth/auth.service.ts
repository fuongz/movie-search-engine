import { Injectable } from '@nestjs/common';
import { SupabaseStrategy } from '../../utils/auth/strategies/supabase/SupabaseStrategy';
import RequestWithUser from './requestWithUser.interface';

@Injectable()
export class AuthService {
  constructor(private supabaseStrategy: SupabaseStrategy) {}

  public async signin(credentials: any) {
    return await this.supabaseStrategy.signin(credentials);
  }

  public async me(req: RequestWithUser) {
    return await this.supabaseStrategy.me(req);
  }

  public async signout(req: RequestWithUser) {
    return await this.supabaseStrategy.signout(req);
  }
}
