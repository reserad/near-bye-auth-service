import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user as BackendUser } from '@prisma/client';

@Injectable()
export class BackendUserService {
  constructor(private readonly prismaService: PrismaService) {}
  async fetch(phoneNumber: string): Promise<BackendUser> {
    return await this.prismaService.user.findUniqueOrThrow({
      where: { phone_number: phoneNumber },
    });
  }
}
