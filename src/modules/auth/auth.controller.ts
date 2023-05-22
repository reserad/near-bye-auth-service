import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpRequestDto } from './dto/otp-request-dto';

export class LoginDto {
  phoneNumber: string;
}

export class VerifyMagicCodeDto {
  magicCode: string;
  phoneNumber: string;
}

@Controller()
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Post('/send-otp')
  async sendOtp(@Body() otpRequestDto: OtpRequestDto) {
    const { phoneNumber } = otpRequestDto;
    this.authService.sendOtp(phoneNumber);
  }
}
