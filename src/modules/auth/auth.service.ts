import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SmsService } from '../sms/sms.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { BackendService } from '../backend/backend.service';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { JwtPayload } from './types/jwt-payload-type';
import { OtpVerificationStatus } from '../sms/types/otp-verification-status.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly smsService: SmsService,
    private readonly backendServie: BackendService,
  ) {}

  async sendOtp(phoneNumber: string) {
    try {
      await this.smsService.sendOtp(phoneNumber);
    } catch (e) {
      const message = 'Failed to send OTP';
      this.logger.error(message, e);
      throw e;
    }
  }

  async verifyOtp(phoneNumber: string, code: string) {
    const user = await this.backendServie.fetchUser(phoneNumber);
    try {
      const { status } = await this.smsService.verifyOtp(phoneNumber, code);
      if (status !== OtpVerificationStatus.APPROVED) {
        throw new Error('Status not approved');
      }
      return await this.signIn(user);
    } catch (e) {
      const message = 'Invalid code';
      this.logger.error(message, e);
      throw new HttpException(
        { statusCode: HttpStatus.NOT_FOUND, message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getAccessToken(payload: JwtPayload) {
    const issuer = this.configService.get<string>('JWT_ISSUER');
    const { userId, phoneNumber } = payload;
    console.log(
      'hiya: ',
      `${this.configService.get<number>('JWT_EXPIRATION_IN_DAYS')}d`,
    );
    return await this.jwtService.signAsync(
      {
        userId,
        phoneNumber,
      },
      {
        secret: this.configService.get<string>('JWT_PRIVATE_KEY'),
        algorithm: 'RS256',
        expiresIn: `${this.configService.get<number>(
          'JWT_EXPIRATION_IN_DAYS',
        )}d`,
        issuer,
      },
    );
  }

  async getRefreshToken(payload: JwtPayload) {
    const issuer = this.configService.get<string>('JWT_ISSUER');
    const { userId, phoneNumber } = payload;
    return await this.jwtService.signAsync(
      {
        userId,
        phoneNumber,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_PRIVATE_KEY'),
        algorithm: 'RS256',
        expiresIn: `${this.configService.get<number>(
          'JWT_REFRESH_EXPIRATION_IN_DAYS',
        )}d`,
        issuer,
      },
    );
  }

  async getTokens(payload: JwtPayload) {
    const accessToken = await this.getAccessToken(payload);
    console.log('1.5');
    const refreshToken = await this.getRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(tokenId: string, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.backendServie.updateRefreshToken(tokenId, hashedRefreshToken);
  }

  async generateTokens(payload: JwtPayload, tokenId: string) {
    const { accessToken, refreshToken } = await this.getTokens(payload);

    const hashedRefreshToken = await argon.hash(refreshToken);
    const token = await this.backendServie.updateRefreshToken(
      tokenId,
      hashedRefreshToken,
    );
    return {
      accessToken,
      refreshToken,
      tokenId: token.id,
      user: {
        id: payload.userId,
        phoneNumber: payload.phoneNumber,
      },
    };
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    tokenId: string,
    payload: JwtPayload,
  ) {
    const foundToken = await this.backendServie.getToken(tokenId);

    const isMatch = await argon.verify(foundToken.token ?? '', refreshToken);

    if (foundToken == null) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (isMatch) {
      return await this.generateTokens(payload, tokenId);
    }

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  async signIn(user: User) {
    const payload: JwtPayload = {
      phoneNumber: user.phoneNumber,
      userId: user.id,
    };
    const { accessToken, refreshToken } = await this.getTokens(payload);
    console.log('here 2');
    try {
      const hashedToken = await argon.hash(refreshToken);
      console.log('here 3');
      const token = await this.backendServie.addRefreshToken(
        user.id,
        hashedToken,
      );

      return {
        accessToken,
        refreshToken,
        tokenId: token.id,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  async signOut(tokenId: string) {
    await this.backendServie.removeRefreshToken(tokenId);
  }
}
