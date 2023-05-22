import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadType } from './types/jwt-payload-type';
import { JwtStrategyPayload } from './types/jwt-strategy-payload-type';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayloadType): Promise<JwtStrategyPayload> {
    const { id, phoneNumber } = payload;
    return {
      id,
      phoneNumber,
    };
  }
}
