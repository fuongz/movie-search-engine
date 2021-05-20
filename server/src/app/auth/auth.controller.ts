import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import SupabaseAuthGuard from './auth.guard';
import RequestWithUser from './requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  public async signin(@Res() res: Response, @Body() body: any): Promise<any> {
    try {
      const data = await this.authService.signin(body);
      return res.status(HttpStatus.OK).json({ data });
    } catch (err) {
      return res
        .status(err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('me')
  async me(@Res() res: Response, @Req() req: RequestWithUser) {
    try {
      const data = await this.authService.me(req);
      return res.status(HttpStatus.OK).json({ data });
    } catch (err) {
      return res
        .status(err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('signout')
  async signout(@Res() res: Response, @Req() req: RequestWithUser) {
    try {
      const data = await this.authService.signout(req);
      return res
        .status(HttpStatus.OK)
        .json(typeof data === 'string' ? { message: data } : { data });
    } catch (err) {
      return res
        .status(err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }
}
