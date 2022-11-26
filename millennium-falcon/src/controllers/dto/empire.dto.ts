import { HunterPositionDto } from 'controllers/dto/hunter-position.dto';

export class EmpireDto {
  countdown: number;
  bounty_hunters: HunterPositionDto[];
}
