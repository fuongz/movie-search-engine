import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseStrategy } from '../../utils/auth/strategies/supabase/SupabaseStrategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'supabase',
      session: false,
    }),
  ],
  providers: [AuthService, SupabaseStrategy],
  controllers: [AuthController],
  exports: [AuthService, SupabaseStrategy],
})
export class AuthModule {}
