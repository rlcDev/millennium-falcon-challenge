import {Injectable, Logger} from '@nestjs/common';
import {EmpireDto} from 'controllers/dto/empire.dto';
import {OddMissionService} from "services/odd-mission/odd-mission.service";
import {Empire} from "models/empire.model";
import {HunterPosition} from "../../models/hunter-position.model";
import {HunterPositionDto} from "../../controllers/dto/hunter-position.dto";

@Injectable()
export class EmpireService {

    private readonly logger: Logger = new Logger(EmpireService.name);

    constructor(private readonly oddMissionService: OddMissionService) {
    }

    /**
     * Process imported empire
     * @param empireDto {EmpireDto}
     */
    processImportedEmpire(empireDto: EmpireDto): Empire {
        this.logger.log(`Processing imported empire`);
        const countdown = empireDto.countdown;
        // validation
        this.logger.log(`Countdown ${countdown}`);
        const hunterPositions: HunterPosition[] = [];

        empireDto.bounty_hunters.forEach((position: HunterPositionDto) => {
            const foundPosition: HunterPosition = hunterPositions.find((position: HunterPosition) => position.planetName === position.planetName);
            if (foundPosition) {
                foundPosition.daysOfPresence.push(position.day);
            } else {
                hunterPositions.push(new HunterPosition(position.planet, [position.day]));
            }
        });
        const empire: Empire = new Empire(countdown, hunterPositions);
        this.logger.log(`Empire process successfully`);
        return empire;
    }
}
