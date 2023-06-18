import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PinoLogger } from 'nestjs-pino';
import { user } from '@prisma/client';

@Injectable()
export class BackendUserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: PinoLogger,
  ) {}
  async fetch(phoneNumber: string): Promise<user> {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: { phone_number: phoneNumber },
      });
    } catch (e) {
      const message = 'Failed fetch user';
      this.logger.error(message, e);
      throw e;
    }
  }
}
