import { CACHE_MANAGER, Inject, Injectable, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";
import { RoutesService } from "services/routes/routes.service";
import { ConfigService } from "@nestjs/config";
import { Route } from "models/route.model";
import { Galaxy } from "models/galaxy.model";
import { Planet } from "models/planet.model";
import { Falcon } from "models/falcon.model";
import { FALCON, GALAXY } from "services/constants/services.constants";
import * as serialijse from "serialijse";

@Injectable()
export class UniverseService {
  private readonly logger: Logger = new Logger(UniverseService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly routesService: RoutesService,
    private readonly configService: ConfigService
  ) {
    // We have circular dependencies in out data model as the graph is not oriented
    // So the entities cannot be serialized directly to be cached
    serialijse.declarePersistable(Galaxy);
    serialijse.declarePersistable(Planet);
    serialijse.declarePersistable(Falcon);
  }

  /**
   * Get galaxy
   * If it's not built or ttl reached --> cache it for 10 min
   * If built retrieve from cache
   * @return {Galaxy}
   */
  async getGalaxy(): Promise<Galaxy> {
    const galaxySerialized: string = await this.cacheManager.get(GALAXY);
    if (galaxySerialized === undefined) {
      this.logger.log("Galaxy is not cached");
      const newGalaxy = await this.createFromUniverse();
      this.logger.log("Caching galaxy");
      await this.cacheManager.set(GALAXY, serialijse.serialize(newGalaxy));
      return newGalaxy;
    } else {
      this.logger.log("Retrieving the galaxy from the cache");
      return serialijse.deserialize<Galaxy>(galaxySerialized);
    }
  }

  /**
   * Get falcon
   * If it's not built or ttl reached --> cache it for 10 min
   * If built retrieve from cache
   * @return {Falcon}
   */
  async getFalcon(galaxy: Galaxy): Promise<Falcon> {
    const falconSerialize: string = await this.cacheManager.get(FALCON);
    if (falconSerialize === undefined) {
      this.logger.log("Falcon is not cached");
      const newFalcon = await this.createFalcon(galaxy);
      this.logger.log("Caching falcon");
      await this.cacheManager.set(FALCON, serialijse.serialize(newFalcon));
      return newFalcon;
    } else {
      this.logger.log("Retrieving the falcon from the cache");
      return serialijse.deserialize<Falcon>(falconSerialize);
    }
  }

  /**
   * Build the galaxy from the universe
   * @return {Galaxy} the galaxy
   * @private
   */
  private async createFromUniverse(): Promise<Galaxy> {
    const routes: Route[] = await this.routesService.getAllRoutes();
    // We first create the planets
    const planetNames: Set<string> = new Set<string>(
      routes
        .map((route: Route) => `${route.origin},${route.destination}`)
        .join(",")
        .split(",")
    );
    this.logger.log(`Found ${planetNames.size} planets`);
    const planets: Planet[] = [];
    planetNames.forEach((planetName: string) =>
      planets.push(new Planet(planetName))
    );

    // Then , we define each neighbor
    planets.forEach((planet: Planet) => {
      const routesForPlanet: Route[] = routes.filter(
        (route: Route) => route.origin === planet.name
      );
      routesForPlanet.forEach((route: Route) => {
        const destinationPlanet: Planet = planets.find(
          (planet: Planet) => route.destination === planet.name
        );
        planet.addNeighbor(destinationPlanet, route.travel_time);
      });
    });
    this.logger.log(`Planets created and neighbors set`);
    const galaxy: Galaxy = new Galaxy(planets);
    this.logger.log(`Galaxy created`);
    return galaxy;
  }

  /**
   * Create falcon
   * @param galaxy {Galaxy}
   * @return {Falcon}
   * @private
   */
  private async createFalcon(galaxy: Galaxy): Promise<Falcon> {
    const departurePlanet: string = this.configService.get<string>("departure");
    const arrivalPlanet: string = this.configService.get<string>("arrival");
    const autonomy: number = this.configService.get<number>("autonomy");

    if (!departurePlanet || !galaxy.doesContainsPlanet(departurePlanet)) {
      this.logger.error(`Invalid departure planet: ${departurePlanet}`);
    }
    this.logger.log(`Departure planet: ${departurePlanet}`);

    if (!arrivalPlanet || !galaxy.doesContainsPlanet(arrivalPlanet)) {
      this.logger.error(`Invalid arrival planet: ${arrivalPlanet}`);
    }
    this.logger.log(`Arrival planet: ${arrivalPlanet}`);

    if (autonomy < 0) {
      this.logger.error(`Invalid autonomy : ${autonomy}`);
    }
    this.logger.log(`Autonomy: ${autonomy}`);
    const falcon: Falcon = new Falcon(autonomy, departurePlanet, arrivalPlanet);
    this.logger.log(`Falcon created`);
    return falcon;
  }
}
