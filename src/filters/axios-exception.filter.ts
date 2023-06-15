import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AxiosError } from 'axios';

export type NearByeExceptionResponse = {
  statusCode: number;
  message: string;
};

@Catch(AxiosError)
export class AxiosExceptionFilter extends BaseExceptionFilter {
  catch(exception: AxiosError, host: ArgumentsHost) {
    const { message, statusCode } = <NearByeExceptionResponse>(
      exception.response.data
    );

    switch (statusCode) {
      case HttpStatus.NOT_FOUND:
        const statusCode = HttpStatus.NOT_FOUND;
        super.catch(
          new HttpException({ statusCode, message }, statusCode),
          host,
        );
        break;

      default:
        // default 500 error code
        super.catch(exception, host);
        break;
    }
  }
}
