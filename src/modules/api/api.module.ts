import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ApiService } from './api.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
