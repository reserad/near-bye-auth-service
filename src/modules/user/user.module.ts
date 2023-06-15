import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { ApiService } from 'src/modules/api/api.service';

@Module({
  imports: [ConfigModule],
  providers: [UserService, ApiService],
})
export class UserModule {}
