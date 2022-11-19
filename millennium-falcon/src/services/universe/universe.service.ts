import { Injectable, Logger } from "@nestjs/common";
import { RoutesService } from "services/routes/routes.service";
import { ConfigService } from "@nestjs/config";
import { Route } from "models/route.model";
import { Galaxy } from "models/galaxy.model";
import { Planet } from "models/planet.model";
import { Falcon } from "models/falcon.model";

@Injectable()
export class UniverseService {
  private readonly logger: Logger = new Logger(UniverseService.name);
  private galaxy: Galaxy | null = null;
  private falcon: Falcon | null = null;

  constructor(
    private readonly routesService: RoutesService,
    private readonly configService: ConfigService
  ) {
  }

  async getGalaxy(): Promise<Galaxy> {
    if (this.galaxy === null) {
      this.galaxy = await this.createUniverse();
    }
    return this.galaxy;
  }

  async getFalcon(galaxy: Galaxy): Promise<Falcon> {
    if (this.falcon === null) {
      this.falcon = await this.createFalcon(galaxy);
    }
    return this.falcon;
  }

  /**
   * Build the universe from
   * @return {Galaxy}
   * @private
   */
  private async createUniverse(): Promise<Galaxy> {
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
