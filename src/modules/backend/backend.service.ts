import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PinoLogger } from 'nestjs-pino';
import { user } from '@prisma/client';
import { formatISO, addDays } from 'date-fns';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BackendService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {}
  async fetchUser(phoneNumber: string): Promise<user> {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: { phone_number: phoneNumber },
      });
    } catch (e) {
      const message = 'Failed to fetch user';
      this.logger.error(message, e);
      throw e;
    }
  }

  async addRefreshToken(userId: string, refreshToken: string) {
    this.logger.info('Creating refresh token');
    const createdAt = new Date();
    const expiresAt = addDays(
      createdAt,
      this.configService.get<number>('JWT_EXPIRATION_IN_DAYS'),
    );
    try {
      return await this.prismaService.token.create({
        data: {
          user_id: userId,
          token: refreshToken,
          created_at: formatISO(createdAt),
          expires_at: formatISO(expiresAt),
          updated_at: formatISO(createdAt),
        },
      });
    } catch (e) {
      const message = 'Failed to create refresh token';
      this.logger.error(message, e);
      throw e;
    }
  }

  async updateRefreshToken(tokenId: string, refreshToken: string) {
    this.logger.info('Updating refresh token');
    const createdAt = new Date();
    const expiresAt = addDays(
      createdAt,
      this.configService.get<number>('JWT_EXPIRATION_IN_DAYS'),
    );
    try {
      return await this.prismaService.token.update({
        where: { id: tokenId },
        data: {
          token: refreshToken,
          expires_at: formatISO(expiresAt),
          updated_at: formatISO(createdAt),
        },
      });
    } catch (e) {
      const message = 'Failed to update refresh token';
      this.logger.error(message, e);
      throw e;
    }
  }

  async getToken(tokenId: string) {
    try {
      return await this.prismaService.token.findFirstOrThrow({
        where: {
          id: tokenId,
        },
      });
    } catch (e) {
      const message = "Couldn't find token";
      this.logger.error(message, e);
      throw e;
    }
  }

  async removeRefreshToken(id: string) {
    try {
      await this.prismaService.token.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      const message = 'Failed to delete refresh token';
      this.logger.error(message, e);
      throw e;
    }
  }
}
