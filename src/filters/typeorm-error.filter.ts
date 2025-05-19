import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.name;
    const detail = exception.message;

    const errorResponse = {
      statusCode: statusCode,
      message: message,
      detail: detail,
      date: new Date(),
    };

    response.status(statusCode).json(errorResponse);
  }
}
