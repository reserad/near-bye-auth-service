import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;
  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async sendOtp(phoneNumber: string) {
    const serviceSid = this.configService.get<string>(
      'TWILIO_VERIFICATION_SID',
    );
    return await this.twilioClient.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: `+1${phoneNumber}`,
        channel: 'sms',
        locale: 'en',
      });
  }

  async verifyOtp(phoneNumber: string, code: string) {
    const serviceSid = this.configService.get<string>(
      'TWILIO_VERIFICATION_SID',
    );
    return await this.twilioClient.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: `+1${phoneNumber}`, code });
  }
}
