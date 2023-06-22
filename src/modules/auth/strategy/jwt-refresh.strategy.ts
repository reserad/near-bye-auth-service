import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload-type';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_PRIVATE_KEY'),
      algorithms: ['RS256'],
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(request: Request, payload: JwtPayload) {
    console.log('HOWDY DOODY');
    console.log('headers: ', request.headers);
    const refreshToken = request.header('Authorization').split(' ')[1];
    const tokenId = request.header('Token-Id');
    console.log('tokenId: ', tokenId);

    return this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      tokenId,
      payload,
    );
  }
}
