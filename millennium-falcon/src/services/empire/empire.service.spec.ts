import { Test, TestingModule } from '@nestjs/testing';
import { EmpireService } from 'services/empire/empire.service';
import {
  INVALID_COUNTDOWN,
  INVALID_DAY,
  INVALID_PLANET_NAME,
} from 'services/constants/services.constants';
import { EmpireError } from '../errors/empire.error';
import { Empire } from 'models/empire.model';
import { HunterPosition } from 'models/hunter-position.model';

describe('EmpireService', () => {
  let service: EmpireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpireService],
    }).compile();

    service = module.get<EmpireService>(EmpireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if countdown is negative', () => {
    const negativeValue = -1;
    try {
      service.processImportedEmpire({
        countdown: negativeValue,
        bounty_hunters: [],
      });
    } catch (e) {
      expect(e instanceof EmpireError).toBe(true);
      expect(e.message).toBe(`${INVALID_COUNTDOWN}: ${negativeValue}`);
    }
  });

  it('should throw an error if at least one planet is not named properly', () => {
    try {
      service.processImportedEmpire({
        countdown: 0,
        bounty_hunters: [
          { planet: 'A', day: 1 },
          { planet: 'B', day: 2 },
          { planet: '', day: 3 },
        ],
      });
    } catch (e) {
      expect(e instanceof EmpireError).toBe(true);
      expect(e.message).toBe(`${INVALID_PLANET_NAME}: `);
    }
  });

  it('should throw an error if at least one day is negative', () => {
    const negativeDay = -3;
    try {
      service.processImportedEmpire({
        countdown: 0,
        bounty_hunters: [
          { planet: 'A', day: 1 },
          { planet: 'B', day: 2 },
          { planet: 'C', day: negativeDay },
        ],
      });
    } catch (e) {
      expect(e instanceof EmpireError).toBe(true);
      expect(e.message).toBe(`${INVALID_DAY}: ${negativeDay}`);
    }
  });

  it('should built the empire properly', () => {
    const empire: Empire = service.processImportedEmpire({
      countdown: 0,
      bounty_hunters: [
        { planet: 'A', day: 1 },
        { planet: 'B', day: 2 },
        { planet: 'B', day: 5 },
        { planet: 'C', day: 3 },
      ],
    });
    expect(empire).toBeDefined();
    expect(empire.countdown).toEqual(0);
    expect(empire.hunterPositions[0]).toBeDefined();
    expect(empire.hunterPositions.length).toEqual(3);

    const hunterPosition: HunterPosition = empire.hunterPositions[0];
    expect(hunterPosition.planetName).toEqual('A');
    expect(hunterPosition.daysOfPresence).toBeDefined();
    expect(hunterPosition.daysOfPresence.length).toEqual(1);
    expect(hunterPosition.daysOfPresence[0]).toBeDefined();
    const day = hunterPosition.daysOfPresence[0];
    expect(day).toEqual(1);

    const hunterPosition1: HunterPosition = empire.hunterPositions[1];
    expect(hunterPosition1.planetName).toEqual('B');
    expect(hunterPosition1.daysOfPresence).toBeDefined();
    expect(hunterPosition1.daysOfPresence.length).toEqual(2);
    expect(hunterPosition1.daysOfPresence[0]).toBeDefined();
    expect(hunterPosition1.daysOfPresence.includes(5)).toBe(true);
    expect(hunterPosition1.daysOfPresence.includes(2)).toBe(true);

    const hunterPosition3: HunterPosition = empire.hunterPositions[2];
    expect(hunterPosition3.planetName).toEqual('C');
    expect(hunterPosition3.daysOfPresence).toBeDefined();
    expect(hunterPosition3.daysOfPresence.length).toEqual(1);
    expect(hunterPosition3.daysOfPresence[0]).toBeDefined();
    const day1 = hunterPosition3.daysOfPresence[0];
    expect(day1).toEqual(3);
  });
});
