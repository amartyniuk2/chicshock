import { HttpException, BadRequestException } from '@nestjs/common';

export const handleError = (error: Error, defaultMessage?: string) => {
  if (error instanceof HttpException) {
    throw error;
  }
  throw new BadRequestException(defaultMessage);
};
