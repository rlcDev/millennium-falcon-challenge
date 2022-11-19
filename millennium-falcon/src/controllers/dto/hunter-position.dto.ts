import { ApiProperty } from '@nestjs/swagger';

export class HunterPositionDto {
  @ApiProperty({
    description: 'The planet name',
  })
  planet: string;

  @ApiProperty({
    description: 'Presence day number',
  })
  day: number;
}
