import { HunterPositionDto } from 'controllers/dto/hunter-position.dto';
import { ApiProperty } from '@nestjs/swagger';

export class EmpireDto {
  @ApiProperty({
    description: 'The countdown before the arrival planet is destroyed'
  })
  countdown: number;

  @ApiProperty({
    type: [HunterPositionDto],
    description: 'Bounty Hunters positions on planets',
  })
  bounty_hunters: HunterPositionDto[];
}
