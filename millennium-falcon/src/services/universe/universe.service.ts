import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RoutesService } from 'services/routes/routes.service';
import { ConfigService } from '@nestjs/config';
import { Route } from 'models/route.model';
import { Galaxy } from 'models/galaxy.model';
import { Planet } from 'models/planet.model';
import { Falcon } from 'models/falcon.model';
import {
  ARRIVAL,
  ARRIVAL_PLANET,
  AUTONOMY,
  AUTONOMY_CONFIG,
  CACHING_FALCON,
  CACHING_GALAXY,
  DEPARTURE,
  DEPARTURE_PLANET,
  FALCON,
  FALCON_CREATED,
  FALCON_NOT_CACHED,
  GALAXY,
  GALAXY_CREATED,
  GALAXY_NOT_CACHED,
  GALAXY_READY,
  INVALID_ARRIVAL_PLANET,
  INVALID_AUTONOMY,
  INVALID_DEPARTURE_PLANET,
  INVALID_DESTINATION_PLANET,
  INVALID_ORIGIN_PLANET,
  INVALID_TRAVEL_TIME,
  PLANETS_FOUND,
  RETRIEVE_FALCON_FROM_CACHE,
  RETRIEVE_GALAXY_FROM_CACHE,
} from 'services/constants/services.constants';
import * as serialijse from 'serialijse';
import { UniverseError } from 'services/errors/universe.error';

@Injectable()
export class UniverseService {
  private readonly logger: Logger = new Logger(UniverseService.name);

  static {
    // We have circular dependencies in out data model as the graph is not oriented
    // So the entities cannot be serialized directly to be cached
    serialijse.declarePersistable(Galaxy);
    serialijse.declarePersistable(Planet);
    serialijse.declarePersistable(Falcon);
  }

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly routesService: RoutesService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get galaxy
   * If it's not built or ttl reached --> cache it for 10 min
   * If built retrieve from cache
   * @return {Galaxy}
   */
  async getGalaxy(): Promise<Galaxy> {
    const galaxySerialized: string = await this.cacheManager.get(GALAXY);
    if (galaxySerialized === undefined) {
      this.logger.log(`${GALAXY_NOT_CACHED}`);
      const newGalaxy = await this.createFromUniverse();
      this.logger.log(`${CACHING_GALAXY}`);
      await this.cacheManager.set(GALAXY, serialijse.serialize(newGalaxy));
      return newGalaxy;
    } else {
      this.logger.log(`${RETRIEVE_GALAXY_FROM_CACHE}`);
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
      this.logger.log(`${FALCON_NOT_CACHED}`);
      const newFalcon = await this.createFalcon(galaxy);
      this.logger.log(`${CACHING_FALCON}`);
      await this.cacheManager.set(FALCON, serialijse.serialize(newFalcon));
      return newFalcon;
    } else {
      this.logger.log(`${RETRIEVE_FALCON_FROM_CACHE}`);
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
        .map((route: Route) => {
          // All origin planets should be defined properly
          if (!route.origin) {
            throw new UniverseError(
              `${INVALID_ORIGIN_PLANET}: ${route.origin}`,
              this.logger,
            );
          }
          // All destination planets should be defined properly
          if (!route.destination) {
            throw new UniverseError(
              `${INVALID_DESTINATION_PLANET}: ${route.destination}`,
              this.logger,
            );
          }
          return `${route.origin},${route.destination}`;
        })
        .join(',')
        .split(','),
    );
    this.logger.log(`${planetNames.size} ${PLANETS_FOUND}`);
    const planets: Planet[] = [];
    planetNames.forEach((planetName: string) =>
      planets.push(new Planet(planetName)),
    );

    // Then , we define each neighbor
    planets.forEach((planet: Planet) => {
      const routesForPlanet: Route[] = routes.filter(
        (route: Route) => route.origin === planet.name,
      );
      routesForPlanet.forEach((route: Route) => {
        // All time travel should be strictly positive
        if (route.travel_time <= 0) {
          throw new UniverseError(
            `${INVALID_TRAVEL_TIME}: ${route.travel_time}`,
            this.logger,
          );
        }

        const destinationPlanet: Planet = planets.find(
          (planet: Planet) => route.destination === planet.name,
        );
        planet.addNeighbor(destinationPlanet, route.travel_time);
      });
    });
    this.logger.log(`${GALAXY_READY}`);
    const galaxy: Galaxy = new Galaxy(planets);
    this.logger.log(`${GALAXY_CREATED}`);
    return galaxy;
  }

  /**
   * Create falcon
   * @param galaxy {Galaxy}
   * @return {Falcon}
   * @private
   */
  private async createFalcon(galaxy: Galaxy): Promise<Falcon> {
    const departurePlanet: string = this.configService.get<string>(
      `${DEPARTURE}`,
    );
    const arrivalPlanet: string = this.configService.get<string>(`${ARRIVAL}`);
    const autonomy: number = this.configService.get<number>(
      `${AUTONOMY_CONFIG}`,
    );

    // This case should not happen
    // Here I'm making the choice to throw an error
    if (!departurePlanet || !galaxy.doesContainsPlanet(departurePlanet)) {
      throw new UniverseError(
        `${INVALID_DEPARTURE_PLANET}: ${departurePlanet}`,
        this.logger,
      );
    }
    this.logger.log(`${DEPARTURE_PLANET}: ${departurePlanet}`);

    // Same here
    if (!arrivalPlanet || !galaxy.doesContainsPlanet(arrivalPlanet)) {
      throw new UniverseError(
        `${INVALID_ARRIVAL_PLANET}: ${arrivalPlanet}`,
        this.logger,
      );
    }
    this.logger.log(`${ARRIVAL_PLANET}: ${arrivalPlanet}`);

    // No check is required on the autonomy --> just log it as error
    if (autonomy < 0) {
      this.logger.error(`${INVALID_AUTONOMY}: ${autonomy}`);
    }
    this.logger.log(`${AUTONOMY}: ${autonomy}`);
    const falcon: Falcon = new Falcon(autonomy, departurePlanet, arrivalPlanet);
    this.logger.log(`${FALCON_CREATED}`);
    return falcon;
  }
}
