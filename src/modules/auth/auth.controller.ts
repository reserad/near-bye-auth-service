import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpRequestDto } from './dto/otp-request-dto';
import { OtpVerifyDto } from './dto/otp-verify-dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Post('/send')
  async sendOtp(@Body() otpRequestDto: OtpRequestDto) {
    const { phoneNumber } = otpRequestDto;
    return await this.authService.sendOtp(phoneNumber);
  }

  @Post('/verify')
  async verifyOtp(@Body() otpVerifyDto: OtpVerifyDto) {
    const { phoneNumber, code } = otpVerifyDto;
    return await this.authService.verifyOtp(phoneNumber, code);
  }
}
