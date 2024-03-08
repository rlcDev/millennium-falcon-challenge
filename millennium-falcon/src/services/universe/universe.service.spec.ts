import { Test, TestingModule } from "@nestjs/testing";
import { UniverseService } from "services/universe/universe.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { RoutesService } from "services/routes/routes.service";
import { ConfigModule } from "@nestjs/config";
import universeJson from "config/configuration";
import { RepositoryModule } from "repositories/repositoryModule";
import { Route } from "models/route.model";
import {
  INVALID_ARRIVAL_PLANET,
  INVALID_DEPARTURE_PLANET,
  INVALID_DESTINATION_PLANET,
  INVALID_ORIGIN_PLANET,
  INVALID_TRAVEL_TIME
} from "services/constants/services.constants";
import { UniverseError } from "services/errors/universe.error";
import { Galaxy } from "models/galaxy.model";
import { Planet } from "models/planet.model";
import { Falcon } from "models/falcon.model";
import * as serialijse from "serialijse";

describe("UniverseService", () => {
  let service: UniverseService;
  let routeService: RoutesService;
  let getFromCache: Function;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({
        load: [universeJson],
        isGlobal: true
      }), RepositoryModule],
      providers: [UniverseService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => getFromCache(),
            set: () => {
            }
          }
        }, RoutesService]
    }).compile();
    service = module.get<UniverseService>(UniverseService);
    routeService = module.get<RoutesService>(RoutesService);
    getFromCache = () => undefined;
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should getGalaxy fails if any origin planet is not defined", async () => {
    jest.spyOn(routeService, "getAllRoutes").mockReturnValue(
      Promise.resolve([
        { origin: "", destination: "B", travel_time: 1 },
        { origin: "A", destination: "C", travel_time: 1 }
      ] as Route[]));
    try {
      await service.getGalaxy();
    } catch (e) {
      expect(e instanceof UniverseError).toBe(true);
      expect(e.message).toBe(`${INVALID_ORIGIN_PLANET}: `);
    }
  });

  it("should getGalaxy fails if any destination planet is not defined", async () => {
    jest.spyOn(routeService, "getAllRoutes").mockReturnValue(
      Promise.resolve([
        { origin: "A", destination: "B", travel_time: 1 },
        { origin: "A", destination: "", travel_time: 1 }
      ] as Route[]));
    try {
      await service.getGalaxy();
    } catch (e) {
      expect(e instanceof UniverseError).toBe(true);
      expect(e.message).toBe(`${INVALID_DESTINATION_PLANET}: `);
    }
  });

  it("should getGalaxy fails if any travel time is negative", async () => {
    jest.spyOn(routeService, "getAllRoutes").mockReturnValue(
      Promise.resolve([
        { origin: "A", destination: "B", travel_time: 1 },
        { origin: "A", destination: "C", travel_time: -1 }
      ] as Route[]));
    try {
      await service.getGalaxy();
    } catch (e) {
      expect(e instanceof UniverseError).toBe(true);
      expect(e.message).toBe(`${INVALID_TRAVEL_TIME}: -1`);
    }
  });

  it("should getFalcon fails if the Falcon's departure planet is not the the galaxy", async () => {
    jest.spyOn(routeService, "getAllRoutes").mockReturnValue(
      Promise.resolve([
        { origin: "A", destination: "B", travel_time: 1 },
        { origin: "A", destination: "C", travel_time: 1 }
      ] as Route[]));
    const galaxy: Galaxy = new Galaxy([new Planet("A"), new Planet("B"), new Planet("C")]);
    try {
      await service.getFalcon(galaxy);
    } catch (e) {
      expect(e instanceof UniverseError).toBe(true);
      expect(e.message).toBe(`${INVALID_DEPARTURE_PLANET}: Tatooine`);
    }
  });

  it("should getFalcon fails if the Falcon's arrival planet is not the the galaxy", async () => {
    jest.spyOn(routeService, "getAllRoutes").mockReturnValue(
      Promise.resolve([
        { origin: "A", destination: "B", travel_time: 1 },
        { origin: "A", destination: "C", travel_time: 1 }
      ] as Route[]));
    const galaxy: Galaxy = new Galaxy([new Planet("A"), new Planet("Tatooine"), new Planet("C")]);
    try {
      await service.getFalcon(galaxy);
    } catch (e) {
      expect(e instanceof UniverseError).toBe(true);
      expect(e.message).toBe(`${INVALID_ARRIVAL_PLANET}: Endor`);
    }
  });

  it("should getFalcon build the Falcon properly if all checks passed", async () => {
    jest.spyOn(routeService, "getAllRoutes").mockReturnValue(
      Promise.resolve([
        { origin: "A", destination: "B", travel_time: 1 },
        { origin: "A", destination: "C", travel_time: 1 }
      ] as Route[]));
    const departurePlanetName = "Tatooine";
    const arrivalPlanetName = "Endor";
    const galaxy: Galaxy = new Galaxy([new Planet("A"), new Planet("B"), new Planet("C"), new Planet(departurePlanetName), new Planet(arrivalPlanetName)]);
    const falcon: Falcon = await service.getFalcon(galaxy);
    expect(falcon).toBeDefined();
    expect(falcon.departurePlanetName).toBeDefined();
    expect(falcon.departurePlanetName).toEqual(departurePlanetName);
    expect(falcon.arrivalPlanetName).toBeDefined();
    expect(falcon.arrivalPlanetName).toEqual(arrivalPlanetName);
    expect(falcon.autonomy).toEqual(6);
  });

  it("should getFalcon get the Falcon properly if all checks passed", async () => {
    jest.spyOn(routeService, "getAllRoutes").mockReturnValue(
      Promise.resolve([
        { origin: "A", destination: "B", travel_time: 1 },
        { origin: "A", destination: "C", travel_time: 1 }
      ] as Route[]));
    const departurePlanetName = "Tatooine";
    const arrivalPlanetName = "Endor";
    const galaxy: Galaxy = new Galaxy([new Planet("A"), new Planet("B"), new Planet("C"), new Planet(departurePlanetName), new Planet(arrivalPlanetName)]);
    const falcon: Falcon = await service.getFalcon(galaxy);
    expect(falcon).toBeDefined();
    expect(falcon.departurePlanetName).toBeDefined();
    expect(falcon.departurePlanetName).toEqual(departurePlanetName);
    expect(falcon.arrivalPlanetName).toBeDefined();
    expect(falcon.arrivalPlanetName).toEqual(arrivalPlanetName);
    expect(falcon.autonomy).toEqual(6);
  });

  it("should getGalaxy get the Galaxy properly if all checks passed", async () => {
    jest.spyOn(routeService, "getAllRoutes").mockReturnValue(
      Promise.resolve([
        { origin: "A", destination: "B", travel_time: 1 },
        { origin: "A", destination: "C", travel_time: 1 }
      ] as Route[]));
    const galaxy: Galaxy = await service.getGalaxy();
    expect(galaxy).toBeDefined();
    expect(galaxy.planets).toBeDefined();
    expect(galaxy.planets.length).toEqual(3);
    const planetNames: string[] = galaxy.planets.map((planet: Planet) => planet.name);
    expect(planetNames.includes("A")).toBe(true);
    expect(planetNames.includes("B")).toBe(true);
    expect(planetNames.includes("C")).toBe(true);
  });

  it("should getGalaxy retrieve the galaxy if it's cached", async () => {
    jest.spyOn(routeService, "getAllRoutes").mockReturnValue(
      Promise.resolve([
        { origin: "A", destination: "B", travel_time: 1 },
        { origin: "A", destination: "C", travel_time: 1 }
      ] as Route[]));
    const galaxy: Galaxy = new Galaxy([new Planet("A")]);
    getFromCache = () => serialijse.serialize(galaxy);
    const galaxyCached: Galaxy = await service.getGalaxy();
    expect(galaxyCached).toBeDefined();
    expect(galaxyCached.planets).toBeDefined();
    expect(galaxyCached.planets.length).toEqual(1);
    expect(galaxyCached.planets[0]).toBeDefined();
    expect(galaxyCached.planets[0].name).toEqual("A");
  });

  it("should getFalcon retrieve the galaxy if it's cached", async () => {
    jest.spyOn(routeService, "getAllRoutes").mockReturnValue(
      Promise.resolve([
        { origin: "A", destination: "B", travel_time: 1 },
        { origin: "A", destination: "C", travel_time: 1 }
      ] as Route[]));
    const falcon: Falcon = new Falcon(8, "A", "Z");
    getFromCache = () => serialijse.serialize(falcon);
    const galaxy: Galaxy = new Galaxy([new Planet("A"), new Planet("Z")]);
    const falconCached: Falcon = await service.getFalcon(galaxy);
    expect(falconCached).toBeDefined();
    expect(falconCached.autonomy).toBeDefined();
    expect(falconCached.autonomy).toEqual(8);
    expect(falconCached.departurePlanetName).toBeDefined();
    expect(falconCached.departurePlanetName).toEqual("A");
    expect(falconCached.arrivalPlanetName).toBeDefined();
    expect(falconCached.arrivalPlanetName).toEqual("Z");
  });
});
