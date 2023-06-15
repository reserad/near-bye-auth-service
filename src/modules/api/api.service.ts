import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  private baseUrl = this.configService.get<string>('BASE_URL');

  async get<T>(url: string, options?: AxiosRequestConfig) {
    const config: AxiosRequestConfig = {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      url,
    };
    const result = await firstValueFrom(this.httpService.request<T>(config));
    return result.data;
  }

  async post<T>(url: string, options?: AxiosRequestConfig) {
    const config: AxiosRequestConfig = {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      url,
    };
    const result = await firstValueFrom(this.httpService.request<T>(config));
    return result.data;
  }
}
