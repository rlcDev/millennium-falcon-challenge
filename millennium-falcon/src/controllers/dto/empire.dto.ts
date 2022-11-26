import { HunterPositionDto } from "controllers/dto/hunter-position.dto";

/**
 * Empire dto class models the imported empire from the JSON file
 *
 * @author Laurent
 * @version 1.0
 */
export class EmpireDto {
  countdown: number;
  bounty_hunters: HunterPositionDto[];
}
