import { PrismaService } from 'nestjs-prisma';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { SignupInput } from '../resolvers/auth/dto/signup.input';
import { Prisma, User } from '@prisma/client';
import { Token } from '../models/token.model';
import { ConfigService } from '@nestjs/config';
import { LoginInput } from 'src/resolvers/auth/dto/login.input';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService
  ) {}

  async createUser(payload: SignupInput): Promise<Token> {
    let hashedPassword = '';
    if (payload.signupType === 'email') {
      hashedPassword = await this.passwordService.hashPassword(
        payload.password
      );
    }

    try {
      const userInfo = {
        username: payload.username,
        firstName: payload.firstName,
        lastName: payload.lastName,
        platformId: payload.platformId,
        platformToken: payload.platformToken,
        email: payload.email,
        password: hashedPassword,
        expoPushToken: payload.expoPushToken,
        signupType: payload.signupType,
        emailVerified: false,
        status: 'active',
      };

      if (payload.signupType === 'facebook') {
        // verify token
        const result = await axios({
          method: 'GET',
          url: `https://graph.facebook.com/me?access_token=${payload.platformToken}`,
        });
        if (result.data.id !== payload.platformId) {
          throw new Error(
            'please provide a valid platform token and platform id'
          );
        }
        const existingUser = await this.prisma.user.findFirst({
          where: {
            platformId: payload.platformId,
          },
        });
        if (existingUser && result.data.id === existingUser.platformId) {
          return this.generateTokens({
            userId: existingUser.id,
          });
        }
      }

      const user = await this.prisma.user.create({
        data: userInfo,
      });

      // create notification settings
      await this.prisma.notificationSettings.create({
        data: {
          userId: user.id,
          pauseNotifications: false,
          friendRequestsNotificationsOn: true,
          followNotificationsOn: true,
          votingExpiredNotificationsOn: true,
        },
      });

      return this.generateTokens({
        userId: user.id,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`email/username already in use.`);
      } else {
        throw new BadRequestException(e);
      }
    }
  }

  async login(data: LoginInput): Promise<Token> {
    let user: any;

    if (data.email) {
      user = await this.prisma.user.findUnique({
        where: { email: data.email },
        include: {
          notificationSettings: true,
        },
      });
    }

    if (data.username) {
      user = await this.prisma.user.findUnique({
        where: { username: data.username },
        include: {
          notificationSettings: true,
        },
      });
    }

    if (!user) {
      throw new NotFoundException(
        `No user found with these credentials, please signup`
      );
    }

    const passwordValid = await this.passwordService.validatePassword(
      data.password,
      user.password
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    if (user.isBanned) {
      throw new UnauthorizedException(
        'You are banned, contact support for details'
      );
    }

    return this.generateTokens({
      userId: user.id,
    });
  }

  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({ where: { id } });
  }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
    });
  }

  private generateRefreshToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async tiktokLogin(req: any, res: any) {
    console.log('req', req);
  }

  async facebookGoogleLogin(req: any, authType: string): Promise<Token> {
    if (!req.user) {
      throw new NotFoundException('No user found');
    }

    const { email, firstName, lastName, picture, emailVerified } = req.user;

    // find user first, if exists signin if not sugnup
    const userFound = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userFound) {
      const userInfo: any = {
        signupType: authType,
        email,
        emailVerified,
        status: 'active',
        firstName,
        lastName,
        picture,
      };

      const createdUser = await this.prisma.user.create({
        data: userInfo,
      });

      return this.generateTokens({
        userId: createdUser.id,
      });
    }

    return this.generateTokens({
      userId: userFound.id,
    });
  }
}
