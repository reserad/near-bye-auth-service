import { Injectable } from '@nestjs/common';

type FetchPayload = {
  phoneNumber?: string;
  id?: string;
};

@Injectable()
export class ApiService {
  async fetchUser(payload: FetchPayload) {}
}
