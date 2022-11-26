import { Logger } from "@nestjs/common";

export class CustomError extends Error {
  constructor(msg: string, logger: Logger, Class) {
    super(msg);
    logger.error(msg);
    Object.setPrototypeOf(this, Class.prototype);
  }
}