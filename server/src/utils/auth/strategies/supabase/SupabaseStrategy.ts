import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { SupabaseAuthStrategy } from './SupabaseAuthStrategy';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(
  SupabaseAuthStrategy,
  'supabase',
) {
  public constructor(configService: ConfigService) {
    super({
      supabaseUrl: configService.get<string>('SUPABASE_URL'),
      supabaseKey: configService.get<string>('SUPABASE_KEY'),
      supabaseOptions: {},
      supabaseJwtSecret: configService.get<string>('SUPABASE_JWT_SECRET'),
      extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
}
