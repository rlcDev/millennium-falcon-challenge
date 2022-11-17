import {Injectable, Logger, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {RoutesService} from "services/routes/routes.service";
import {ConfigService} from "@nestjs/config";
import {Route} from "models/route.model";
import {Subscription} from "rxjs";
import {Galaxy} from "models/galaxy.model";
import {Planet} from "models/planet.model";
import {Falcon} from "models/falcon.model";

@Injectable()
export class UniverseService implements OnModuleInit, OnModuleDestroy {

    private readonly subscriptions: Subscription[] = [];
    private readonly logger: Logger = new Logger(UniverseService.name);
    galaxy: Galaxy;
    falcon: Falcon;

    constructor(private readonly routesService: RoutesService, private readonly configService: ConfigService) {
    }

    onModuleDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
        }
    }

    onModuleInit() {
        this.subscriptions.push(this.routesService.getAllRoutes().subscribe({
            next: (routes: Route[]) => {
                this.galaxy = this.createUniverse(routes);
                this.falcon = this.createFalcon();
            },
            error: (error) => {
                this.logger.error('Error while retrieving the routes', error)
            }
        }));
    }

    /**
     * Build the universe from
     * @param routes {Array} of routes
     * @return {Galaxy}
     * @private
     */
    private createUniverse(routes: Route[]): Galaxy {
        // We first create the planets
        const planetNames: Set<string> = new Set<string>(routes.map((route: Route) => `${route.origin},${route.destination}`).join(",").split((",")));
        this.logger.log(`Found ${planetNames.size} planets`);
        const planets: Planet[] = [];
        planetNames.forEach((planetName: string) => planets.push(new Planet(planetName)));

        // Then , we define each neighbor
        planets.forEach((planet: Planet) => {
            const routesForPlanet: Route[] = routes.filter((route: Route) => route.origin === planet.name);
            routesForPlanet.forEach((route: Route) => {
                const destinationPlanet: Planet = planets.find((planet: Planet) => route.destination === planet.name)
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
     * @return {Falcon}
     * @private
     */
    private createFalcon(): Falcon {
        const departurePlanet: string = this.configService.get<string>('departure');
        const arrivalPlanet: string = this.configService.get<string>('arrival');
        const autonomy: number = this.configService.get<number>('autonomy');

        if (!departurePlanet || !this.galaxy.doesContainsPlanet(departurePlanet)) {
            this.logger.error(`Invalid departure planet: ${departurePlanet}`);
        }
        this.logger.log(`Departure planet: ${departurePlanet}`);

        if (!arrivalPlanet || !this.galaxy.doesContainsPlanet(arrivalPlanet)) {
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
