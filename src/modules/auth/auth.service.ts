import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ApiService } from '../api/api.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly api: ApiService,
    private readonly twilio: Twilio,
  ) {}
  async sendOtp(phoneNumber: string) {
    const existingUser = await this.getUserByPhoneNumber(phoneNumber);
  }

  async verifyOtp(phoneNumber: string, code: string) {}
  async createUser(phoneNumber: string) {}

  async getUserByPhoneNumber(phoneNumber: string) {}
}
