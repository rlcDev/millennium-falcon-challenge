import { Logger } from '@nestjs/common';
import { CustomError } from 'services/errors/custom.error';
import { OddMissionService } from 'services/odd-mission/odd-mission.service';

export class OddMissionError extends CustomError {
  constructor(msg: string, logger: Logger) {
    super(msg, logger, OddMissionService);
  }
}
