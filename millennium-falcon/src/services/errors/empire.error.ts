import { Logger } from "@nestjs/common";
import { CustomError } from "services/errors/custom.error";

export class EmpireError extends CustomError {
  constructor(msg: string, logger: Logger) {
    super(msg, logger, EmpireError);
  }
}
