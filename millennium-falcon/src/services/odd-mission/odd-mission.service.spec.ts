import { Test, TestingModule } from '@nestjs/testing';
import { OddMissionService } from './odd-mission.service';
import { HunterPosition } from '../../models/hunter-position.model';
import { Empire } from '../../models/empire.model';
import { Planet } from '../../models/planet.model';
import { Galaxy } from '../../models/galaxy.model';
import { Falcon } from '../../models/falcon.model';

describe('OddMissionService', () => {
  let service: OddMissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OddMissionService],
    }).compile();

    service = module.get<OddMissionService>(OddMissionService);
  });

  it('should be defined', () => {
    const t = 'T';
    const h = 'H';
    const d = 'D';
    const e = 'E';

    const position: HunterPosition = new HunterPosition(h, [6, 7, 8]);

    const empire: Empire = new Empire(10, [position]);

    const pt: Planet = new Planet(t);
    const ph: Planet = new Planet(h);
    const pd: Planet = new Planet(d);
    const pe: Planet = new Planet(e);

    pt.addNeighbor(pd, 6);
    pt.addNeighbor(ph, 6);

    pd.addNeighbor(ph, 1);
    pd.addNeighbor(pe, 4);

    ph.addNeighbor(pe, 1);

    const galaxy: Galaxy = new Galaxy([pt, pd, ph, pe]);

    const autonomy = 6;
    const falcon: Falcon = new Falcon(autonomy, t, e);
    expect(service).toBeDefined();
  });
});
