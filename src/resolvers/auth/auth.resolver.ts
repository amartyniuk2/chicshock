import { Auth } from '../../models/auth.model';
import { Token } from '../../models/token.model';
import { LoginInput } from './dto/login.input';
import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { AuthService } from '../../services/auth.service';
import { SignupInput } from './dto/signup.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { handleError } from 'src/common/exceptions/exceptions';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput) {
    try {
      if (!data.email && !data.username && data.signupType === 'email') {
        const error = new Error();
        return handleError(
          error,
          'please provide email or username and password'
        );
      }
      if (!data.password && data.signupType === 'email') {
        const error = new Error();
        return handleError(error, 'please provide a password');
      }
      const { accessToken, refreshToken } = await this.auth.createUser(data);
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      handleError(error, 'failed to signup user');
    }
  }

  @Mutation(() => Auth)
  async login(@Args('data') data: LoginInput) {
    try {
      const { accessToken, refreshToken } = await this.auth.login(data);
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      handleError(error, 'failed to login user');
    }
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    try {
      return this.auth.refreshToken(token);
    } catch (error) {
      handleError(error, 'failed to get token');
    }
  }

  @ResolveField('user')
  async user(@Parent() auth: Auth) {
    try {
      return await this.auth.getUserFromToken(auth.accessToken);
    } catch (error) {
      handleError(error, 'failed to get user');
    }
  }
}
