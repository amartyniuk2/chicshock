import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-snapchat';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TikTokStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(readonly configService: ConfigService) {
    super({
      clientID: configService.get('SNAPCHAT_CLIENT_ID'),
      clientSecret: configService.get('SNAPCHAT_CLIENT_SECRET'),
      callbackURL: configService.get('SNAPCHAT_CALLBACK_URL'),
      profileFields: ['id', 'displayName', 'bitmoji'],
      scope: ['user.display_name', 'user.bitmoji.avatar'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile
  ): Promise<any> {
    const user = {
      ...profile,
      accessToken: refreshToken,
      refreshToken: accessToken,
    };
    return user;
  }
}
