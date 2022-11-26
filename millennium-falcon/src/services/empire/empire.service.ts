import { Injectable, Logger } from "@nestjs/common";
import { EmpireDto } from "controllers/dto/empire.dto";
import { Empire } from "models/empire.model";
import { HunterPosition } from "models/hunter-position.model";
import { HunterPositionDto } from "controllers/dto/hunter-position.dto";
import {
  COUNTDOWN,
  INVALID_COUNTDOWN,
  INVALID_DAY,
  INVALID_PLANET_NAME,
  PROCESSING_IMPORTED_EMPIRE,
  SUCCESSFULLY_IMPORTED
} from "services/constants/services.constants";
import { EmpireError } from "services/errors/empire.error";

@Injectable()
export class EmpireService {
  private readonly logger: Logger = new Logger(EmpireService.name);

  /**
   * Process imported empire
   *
   * @param empireDto {EmpireDto} The imported empire
   * @return {Empire} the empire mapped
   */
  processImportedEmpire(empireDto: EmpireDto): Empire {
    this.logger.log(PROCESSING_IMPORTED_EMPIRE);
    const countdown = empireDto.countdown;

    //Data integrity validation
    // The countdown should positive or equals to 0
    if (countdown < 0) {
      throw new EmpireError(`${INVALID_COUNTDOWN}: ${countdown}`, this.logger);
    }
    this.logger.log(`${COUNTDOWN} ${countdown}`);

    const hunterPositions: HunterPosition[] = [];
    empireDto.bounty_hunters.forEach((positionFromDto: HunterPositionDto) => {
      // All the planets should be named properly.
      // So far it's not specify if we need to check if the planet is in the galaxy
      // But this does not change anything to the calculation
      if (!positionFromDto.planet) {
        throw new EmpireError(
          `${INVALID_PLANET_NAME}: ${positionFromDto.planet}`,
          this.logger
        );
      }

      //All the provided days should be positive
      if (positionFromDto.day < 0) {
        throw new EmpireError(
          `${INVALID_DAY}: ${positionFromDto.day}`,
          this.logger
        );
      }

      const foundPosition: HunterPosition = hunterPositions.find(
        (position: HunterPosition) =>
          positionFromDto.planet === position.planetName
      );
      if (foundPosition) {
        foundPosition.daysOfPresence.push(positionFromDto.day);
      } else {
        hunterPositions.push(
          new HunterPosition(positionFromDto.planet, [positionFromDto.day])
        );
      }
    });
    const empire: Empire = new Empire(countdown, hunterPositions);
    this.logger.log(`${SUCCESSFULLY_IMPORTED}`);
    return empire;
  }
}
