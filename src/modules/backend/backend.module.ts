import { Module } from '@nestjs/common';
import { BackendService } from './backend.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  providers: [BackendService, PrismaService],
})
export class BackendModule {}
