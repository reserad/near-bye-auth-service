import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([]), HttpModule],
  providers: [],
  exports: [TypeOrmModule],
})
export class ApiModule {}
