import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { ApiModule } from 'src/modules/api/api.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { SmsModule } from '../sms/sms.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule,
    ApiModule,
    PassportModule,
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: '60d',
        issuer: 'NearBye',
      },
    }),
    SmsModule,
    LoggerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, UserService, JwtStrategy],
})
export class AuthModule {}
