import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/types/user.type';
import { SmsService } from '../sms/sms.service';
import { OtpVerificationStatus } from '../sms/types/otp-verification-status.enum';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { UserDto } from '../user/types/user-dto.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly smsService: SmsService,
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
  ) {}

  async sendOtp(userDto: UserDto) {
    const { phoneNumber } = userDto;
    try {
      await this.userService.fetch(phoneNumber);
    } catch (e) {
      await this.userService.create(userDto);
    } finally {
      return await this.smsService.sendOtp(phoneNumber);
    }
  }

  async verifyOtp(phoneNumber: string, code: string) {
    const user = await this.userService.fetch(phoneNumber);
    try {
      const { status } = await this.smsService.verifyOtp(phoneNumber, code);
      if (status !== OtpVerificationStatus.APPROVED) {
        throw new Error('Status not approved');
      }
      return await this.authenticate(user);
    } catch (e) {
      const message = 'Invalid code';
      this.logger.error(message, e);
      throw new HttpException(
        { statusCode: HttpStatus.NOT_FOUND, message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async authenticate(user: User) {
    const { id, phone_number } = user;
    return {
      token: await this.jwtService.signAsync(
        {
          id,
          phoneNumber: phone_number,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      ),
    };
  }

  //async refresh() {}
}
