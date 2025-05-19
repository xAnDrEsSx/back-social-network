import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.name;
      const detail = exception.message;

      response.status(status).json({
        statusCode: status,
        message: message,
        detail: detail,
        date: new Date(),
      });
    } else {
      super.catch(exception, host);
    }
  }
}
