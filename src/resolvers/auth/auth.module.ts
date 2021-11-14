import { PasswordService } from './../../services/password.service';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { AuthService } from '../../services/auth.service';
import { AuthResolver } from './auth.resolver';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/configs/config.interface';
import { GoogleController } from 'src/controllers/google.controller';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [GoogleController],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    GqlAuthGuard,
    PasswordService,
    GoogleStrategy,
  ],
  exports: [GqlAuthGuard],
})
export class AuthModule {}
