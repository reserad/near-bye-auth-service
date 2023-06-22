import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PinoLogger } from 'nestjs-pino';
import { User } from '@prisma/client';
import { formatISO, addDays } from 'date-fns';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BackendService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {}
  async fetchUser(phoneNumber: string): Promise<User> {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: { phoneNumber: phoneNumber },
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
          userId,
          token: refreshToken,
          createdAt: formatISO(createdAt),
          expiresAt: formatISO(expiresAt),
          updatedAt: formatISO(createdAt),
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
          expiresAt: formatISO(expiresAt),
          updatedAt: formatISO(createdAt),
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
