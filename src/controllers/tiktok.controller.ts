import { Controller, Get, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';

@Controller('tiktok')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Get('oauth')
  async tiktokAuth(@Req() req, @Res() res) {
    const csrfState = Math.random().toString(36).substring(7);
    res.cookie('csrfState', csrfState, { maxAge: 60000 });
    const clientId = this.configService.get('TIKTOK_CLIENT_ID');
    let url = `https://open-api.tiktok.com/platform/oauth/connect/`;
    url += `${clientId}`;
    url += '&scope=user.info.basic';
    url += '&response_type=code';
    url += `&redirect_uri=https://dev.chicorshock.com/tiktok/callback`;
    url += '&state=' + csrfState;
    res.redirect(url);
  }

  @Get('callback')
  async tiktokAuthRedirect(@Req() req, @Res() res) {
    return this.authService.tiktokLogin(req, res);
  }
}
