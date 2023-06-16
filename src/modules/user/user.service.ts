import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from './types/user.type';
import { ApiService } from 'src/modules/api/api.service';
import { UserDto } from './types/user-dto.type';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly apiService: ApiService,
  ) {}
  private baseUrl = this.configService.get<string>('BASE_URL');

  private endPoints = {
    users: `${this.baseUrl}/users`,
  };

  async create(userDto: UserDto) {
    return await this.apiService.post<User>(`${this.endPoints.users}`, {
      data: userDto,
    });
  }
}
