import { Module } from '@nestjs/common';
import { BackendUserService } from './backend-user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  providers: [BackendUserService, PrismaService],
})
export class BackendUserModule {}
