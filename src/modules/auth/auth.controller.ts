import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpRequestDto } from './dto/otp-request-dto';
import { OtpVerifyDto } from './dto/otp-verify-dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './user.decorator';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { Request } from 'express';

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

  @UseGuards(JwtAuthGuard)
  @Post('/sign-out')
  async signOut(@Req() request: Request) {
    const tokenId = request.header('Token-Id');
    await this.authService.signOut(tokenId);
    return true;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  async refresh(@User() user) {
    return user;
  }
}
