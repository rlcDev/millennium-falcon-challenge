import { Test, TestingModule } from "@nestjs/testing";
import { OddMissionService } from "services/odd-mission/odd-mission.service";
import { HunterPosition } from "models/hunter-position.model";
import { Empire } from "models/empire.model";
import { Planet } from "models/planet.model";
import { Galaxy } from "models/galaxy.model";
import { Falcon } from "models/falcon.model";
import { ConfigModule } from "@nestjs/config";
import universeJson from "config/configuration";
import { RepositoryModule } from "repositories/repositoryModule";
import { UniverseService } from "services/universe/universe.service";
import { EmpireService } from "services/empire/empire.service";
import { EmpireDto } from "controllers/dto/empire.dto";
import { RoutesService } from "services/routes/routes.service";
import { CACHE_MANAGER } from "@nestjs/common";
import spyOn = jest.spyOn;

describe("OddMissionService", () => {
  const planetNameT: string = "T";
  const planetNameH: string = "H";
  const planetNameD: string = "D";
  const planetNameE: string = "E";

  const position: HunterPosition = new HunterPosition(planetNameH, [6, 7, 8]);

  const planetT: Planet = new Planet(planetNameT);
  const planetH: Planet = new Planet(planetNameH);
  const planetD: Planet = new Planet(planetNameD);
  const planetE: Planet = new Planet(planetNameE);

  planetT.addNeighbor(planetD, 6);
  planetT.addNeighbor(planetH, 6);

  planetD.addNeighbor(planetH, 1);
  planetD.addNeighbor(planetE, 4);

  planetH.addNeighbor(planetE, 1);

  const galaxy: Galaxy = new Galaxy([planetT, planetD, planetH, planetE]);

  const autonomy: number = 6;
  const falcon: Falcon = new Falcon(autonomy, planetNameT, planetNameE);

  let service: OddMissionService;
  let universeService: UniverseService;
  let empireService: EmpireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [universeJson],
          isGlobal: true
        }),
        RepositoryModule
      ],
      providers: [
        OddMissionService,
        UniverseService,
        EmpireService,
        RoutesService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => undefined,
            set: () => {
            }
          }
        }
      ]
    }).compile();

    service = module.get<OddMissionService>(OddMissionService);
    universeService = module.get<UniverseService>(UniverseService);
    empireService = module.get<EmpireService>(EmpireService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return 0 for empire with countdown 7 - see example", async () => {
    const empire: Empire = new Empire(7, [position]);
    spyOn(universeService, "getGalaxy").mockReturnValue(
      Promise.resolve(galaxy)
    );
    spyOn(universeService, "getFalcon").mockReturnValue(
      Promise.resolve(falcon)
    );
    spyOn(empireService, "processImportedEmpire").mockReturnValue(empire);
    expect(await service.tellMeTheOdds({} as EmpireDto)).toEqual(0);
  });

  it("should return 81 for empire with countdown 8 - see example", async () => {
    const empire: Empire = new Empire(8, [position]);
    spyOn(universeService, "getGalaxy").mockReturnValue(
      Promise.resolve(galaxy)
    );
    spyOn(universeService, "getFalcon").mockReturnValue(
      Promise.resolve(falcon)
    );
    spyOn(empireService, "processImportedEmpire").mockReturnValue(empire);
    const odd = await service.tellMeTheOdds({} as EmpireDto);
    expect(odd).toEqual(81);
  });

  it("should return 90 for empire with countdown 9 - see example", async () => {
    const empire: Empire = new Empire(9, [position]);
    spyOn(universeService, "getGalaxy").mockReturnValue(
      Promise.resolve(galaxy)
    );
    spyOn(universeService, "getFalcon").mockReturnValue(
      Promise.resolve(falcon)
    );
    spyOn(empireService, "processImportedEmpire").mockReturnValue(empire);
    const odd = await service.tellMeTheOdds({} as EmpireDto);
    expect(odd).toEqual(90);
  });

  it("should return 100 for empire with countdown 10 - see example", async () => {
    const empire: Empire = new Empire(10, [position]);
    spyOn(universeService, "getGalaxy").mockReturnValue(
      Promise.resolve(galaxy)
    );
    spyOn(universeService, "getFalcon").mockReturnValue(
      Promise.resolve(falcon)
    );
    spyOn(empireService, "processImportedEmpire").mockReturnValue(empire);
    const odd = await service.tellMeTheOdds({} as EmpireDto);
    expect(odd).toEqual(100);
  });

  it("should return 100 if no hunters and countdown high than the minimum days to reach the arrival", async () => {
    const empire: Empire = new Empire(10, []);
    spyOn(universeService, "getGalaxy").mockReturnValue(
      Promise.resolve(galaxy)
    );
    spyOn(universeService, "getFalcon").mockReturnValue(
      Promise.resolve(falcon)
    );
    spyOn(empireService, "processImportedEmpire").mockReturnValue(empire);
    const odd = await service.tellMeTheOdds({} as EmpireDto);
    expect(odd).toEqual(100);
  });

  it("should return 0 if no hunters and countdown lower than the minimum days to reach the arrival", async () => {
    const empire: Empire = new Empire(7, []);
    spyOn(universeService, "getGalaxy").mockReturnValue(
      Promise.resolve(galaxy)
    );
    spyOn(universeService, "getFalcon").mockReturnValue(
      Promise.resolve(falcon)
    );
    spyOn(empireService, "processImportedEmpire").mockReturnValue(empire);
    const odd = await service.tellMeTheOdds({} as EmpireDto);
    expect(odd).toEqual(0);
  });

  it("should return 100 for empire with countdown 20 - passing the minimum critical constraints", async () => {
    const empire: Empire = new Empire(20, []);
    spyOn(universeService, "getGalaxy").mockReturnValue(
      Promise.resolve(galaxy)
    );
    spyOn(universeService, "getFalcon").mockReturnValue(
      Promise.resolve(falcon)
    );
    spyOn(empireService, "processImportedEmpire").mockReturnValue(empire);
    const odd = await service.tellMeTheOdds({} as EmpireDto);
    expect(odd).toEqual(100);
  });

  it("should return 0 if countdown is lower than the first travel", async () => {
    const empire: Empire = new Empire(3, []);
    spyOn(universeService, "getGalaxy").mockReturnValue(
      Promise.resolve(galaxy)
    );
    spyOn(universeService, "getFalcon").mockReturnValue(
      Promise.resolve(falcon)
    );
    spyOn(empireService, "processImportedEmpire").mockReturnValue(empire);
    const odd = await service.tellMeTheOdds({} as EmpireDto);
    expect(odd).toEqual(0);
  });

  it("should return 0 if countdown is 0", async () => {
    const empire: Empire = new Empire(0, []);
    spyOn(universeService, "getGalaxy").mockReturnValue(
      Promise.resolve(galaxy)
    );
    spyOn(universeService, "getFalcon").mockReturnValue(
      Promise.resolve(falcon)
    );
    spyOn(empireService, "processImportedEmpire").mockReturnValue(empire);
    const odd = await service.tellMeTheOdds({} as EmpireDto);
    expect(odd).toEqual(0);
  });

  it("should return 0 if countdown is negative", async () => {
    const empire: Empire = new Empire(-1, []);
    spyOn(universeService, "getGalaxy").mockReturnValue(
      Promise.resolve(galaxy)
    );
    spyOn(universeService, "getFalcon").mockReturnValue(
      Promise.resolve(falcon)
    );
    spyOn(empireService, "processImportedEmpire").mockReturnValue(empire);
    const odd = await service.tellMeTheOdds({} as EmpireDto);
    expect(odd).toEqual(0);
  });
});
