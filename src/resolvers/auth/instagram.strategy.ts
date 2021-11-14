import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-instagram';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InstagramStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(readonly configService: ConfigService) {
    super({
      clientID: configService.get('INSTAGRAM_APP_ID'),
      clientSecret: configService.get('INSTAGRAM_APP_SECRET'),
      callbackURL: 'https://99e175f18e00.ngrok.io/auth/instagram',
      scope: ['user_profile', 'user_media'],
    });
  }
}
