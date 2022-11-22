import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class MissionOddMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(MissionOddMiddleware.name);

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, url } = request;
    response.on('close', () => {
      const { statusCode } = response;
      this.logger.log(
        `VERB: ${method} -- STATUS: ${statusCode} -- FROM(IP) ${ip} -- PATH: mission/${url}`,
      );
    });
    next();
  }
}
