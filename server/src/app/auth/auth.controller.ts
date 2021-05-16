import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Headers,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
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

  @Post('/signup')
  public async signup(@Res() res: Response, @Body() body: any): Promise<any> {
    try {
      const data = await this.authService.signup(body);
      return res.status(HttpStatus.OK).json({ data });
    } catch (err) {
      return res
        .status(err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  @Post('/me')
  public async me(
    @Res() res: Response,
    @Headers('Authorization') authorization: string,
  ): Promise<any> {
    try {
      const data = await this.authService.me(authorization);
      return res.status(HttpStatus.OK).json({ data });
    } catch (err) {
      return res
        .status(err?.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || 'Internal server error' });
    }
  }

  @Post('/signout')
  public async signout(@Res() res: Response): Promise<any> {
    try {
      await this.authService.signout();
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Đăng xuất thành công.' });
    } catch (err) {
      return res
        .status(err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  @Post('/reset-password')
  public async resetPassword(
    @Res() res: Response,
    @Body('email') email: string,
  ): Promise<any> {
    try {
      const data = await this.authService.resetPassword(email);
      return res.status(HttpStatus.OK).json(data);
    } catch (err) {
      return res
        .status(err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }
}
