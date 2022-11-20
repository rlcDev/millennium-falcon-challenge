import { Injectable, Logger } from "@nestjs/common";
import { Planet } from "models/planet.model";
import { SpaceTravelPath } from "models/space-travel-path.model";
import { VisitedPlanet } from "models/visited-planet.model";
import { Galaxy } from "models/galaxy.model";
import { Empire } from "models/empire.model";
import { Falcon } from "models/falcon.model";
import _ from "lodash";
import { UniverseService } from "services/universe/universe.service";
import { EmpireDto } from "controllers/dto/empire.dto";
import { EmpireService } from "services/empire/empire.service";

@Injectable()
export class OddMissionService {

  private readonly logger: Logger = new Logger(OddMissionService.name);

  constructor(private readonly universeService: UniverseService, private readonly empireService: EmpireService) {
  }

  /**
   * Tell me the odd
   *
   * @param empireDto {EmpireDto}
   * @return The odd x  as 0 < x < 100
   */
  async tellMeTheOdds(empireDto: EmpireDto): Promise<number> {
    const startDate: Date = new Date();
    const empire: Empire = this.empireService.processImportedEmpire(empireDto);
    const galaxy: Galaxy = await this.universeService.getGalaxy();
    this.logger.log(`Computing the odd`);
    const completePaths: SpaceTravelPath[] =
      this.getSuccessfulMissionSpaceTravelPaths(
        galaxy,
        empire,
        await this.universeService.getFalcon(galaxy)
      );
    this.printSpaceTravelPaths(completePaths);
    const odd: number = completePaths.length === 0
      ? 0
      : this.computeOdd(this.getHuntersCount(completePaths, empire)) * 100;
    this.logger.log(`Odd ${odd} calculated in ${new Date().getTime() - startDate.getTime()}ms`);
    return odd;
  }

  /**
   * Get Hunters count
   *
   * @param completePaths {Array}
   * @param empire        {Empire}
   * @return {number} Hunters count
   */
  private getHuntersCount(
    completePaths: SpaceTravelPath[],
    empire: Empire
  ): number {
    const startDate: Date = new Date();
    // There is a path and no hunters at all in the universe
    if (completePaths.length > 0 && empire.hunterPositions.length === 0) {
      return 0;
    }
    // First we are looking for the lowest Hunters count for all space travel path reached at the countdown moment
    let lowestHuntersPresenceCount: number = Number.MAX_VALUE;
    const countdown: number = empire.countdown;
    const spaceTravelPathsReachedInTime: SpaceTravelPath[] =
      completePaths.filter(
        (path: SpaceTravelPath) =>
          path.getLastVisitedPlanet().getLastTravelDay() == countdown
      );
    this.logger.log(`${spaceTravelPathsReachedInTime.length} path(s) reached at the countdown`);
    for (const pathReachedTime of spaceTravelPathsReachedInTime) {
      const numberOfHuntersMet: number =
        pathReachedTime.computeHuntersPresenceCount(empire);
      if (numberOfHuntersMet === 0) {
        this.logger.log(`Lowest hunters count is (with a path reached at the countdown): ${numberOfHuntersMet}`);
        this.logger.log(`getHuntersCount took ${new Date().getTime() - startDate.getTime()}ms`);
        return numberOfHuntersMet;
      } else if (numberOfHuntersMet < lowestHuntersPresenceCount) {
        lowestHuntersPresenceCount = numberOfHuntersMet;
      }
    }
    this.logger.log(`Lowest hunters count is for path with buffer is: ${lowestHuntersPresenceCount}`);


    // Then, we are taking all space travel paths reached before the countdown,
    // And we're going to find for the lowest Hunters count by taking a budget days (remaining days)
    // In others word it's about avoiding the Hunters
    let lowestHuntersSimulatedPresenceCount: number = Number.MAX_VALUE;
    const spaceTravelPathsWithBufferDays: SpaceTravelPath[] =
      completePaths.filter(
        (path: SpaceTravelPath) =>
          path.getLastVisitedPlanet().getLastTravelDay() < countdown
      );
    this.logger.log(`${spaceTravelPathsWithBufferDays.length} path(s) with buffer`);
    if (spaceTravelPathsWithBufferDays.length !== 0) {
      for (const pathWithBufferDays of spaceTravelPathsWithBufferDays) {
        const bufferDaysBudget: number =
          countdown -
          pathWithBufferDays.getLastVisitedPlanet().getLastTravelDay();
        for (let addedDay = 1; addedDay <= bufferDaysBudget; addedDay++) {
          for (const visitedPlanet of pathWithBufferDays.visitedPlanets) {
            const simulatedPathWithBuffer: SpaceTravelPath =
              pathWithBufferDays.getShiftedSpaceTravelPath(
                visitedPlanet.name,
                addedDay
              );
            const simulatedHuntersPresenceCount: number =
              simulatedPathWithBuffer.computeHuntersPresenceCount(empire);
            if (simulatedHuntersPresenceCount === 0) {
              this.logger.log(`Lowest hunters count is (with a path with buffer): ${simulatedHuntersPresenceCount}`);
              this.logger.log(`getHuntersCount took ${new Date().getTime() - startDate.getTime()}ms`);
              return simulatedHuntersPresenceCount;
            } else if (
              simulatedHuntersPresenceCount <
              lowestHuntersSimulatedPresenceCount
            ) {
              lowestHuntersSimulatedPresenceCount =
                simulatedHuntersPresenceCount;
            }
          }
        }
      }
      this.logger.log(`Trying to avoid the hunters. Best Hunters count is ${lowestHuntersSimulatedPresenceCount}`);
    }

    // We are taking the minimum
    const bestHuntersCount: number = Math.min(
      lowestHuntersPresenceCount,
      lowestHuntersSimulatedPresenceCount
    );
    this.logger.log(`Eventually, best Hunters count is ${bestHuntersCount}`);
    this.logger.log(`getHuntersCount took ${new Date().getTime() - startDate.getTime()}ms`);
    return bestHuntersCount;
  }

  /**
   * Get all successful travel paths to the arrival planet
   *
   * @param galaxy {Galaxy}
   * @param empire {Empire}
   * @param falcon {Falcon}
   * @return {Array}
   */
  private getSuccessfulMissionSpaceTravelPaths(
    galaxy: Galaxy,
    empire: Empire,
    falcon: Falcon
  ) {
    const startDate: Date = new Date();
    const countdown: number = empire.countdown;
    const autonomy: number = falcon.autonomy;
    const departurePlanet: Planet = galaxy.planets.find(
      (planet: Planet) => falcon.departurePlanetName === planet.name
    );
    const arrivalPlanet: Planet = galaxy.planets.find(
      (planet: Planet) => falcon.arrivalPlanetName === planet.name
    );
    const successfulTravelPaths: SpaceTravelPath[] = [];

    if (departurePlanet && arrivalPlanet) {
      let spaceTravelPaths: SpaceTravelPath[] = [];

      // Initialization : We are creating the root space travel path with the departure planet which is visited on day 0
      spaceTravelPaths.push(
        this.getTheSpaceTravelRootPath(departurePlanet, autonomy)
      );

      while (spaceTravelPaths.length !== 0) {
        let travelPathsTmp: SpaceTravelPath[] = [];

        spaceTravelPaths.forEach((path: SpaceTravelPath) => {
          // We get the last visited planet for the current path
          const lastVisitedPlanet: VisitedPlanet = path.getLastVisitedPlanet();

          // Exploring all its neighbors
          const neighbors: Map<Planet, number> = lastVisitedPlanet.neighbors;
          neighbors.forEach((dayToReachNeighbor: number, neighbor: Planet) => {
            // If we are under the countdown to reach the current neighbor
            if (
              lastVisitedPlanet.getLastTravelDay() + dayToReachNeighbor <=
              countdown
            ) {
              const spaceTravelPathTmp: SpaceTravelPath = _.cloneDeep(path);
              // And if we have enough autonomy to reach it
              if (dayToReachNeighbor <= lastVisitedPlanet.actualAutonomy) {
                // The visited neighbor holds the Falcon state (day when visiting, autonomy updated)
                const visitedNeighbor: VisitedPlanet = new VisitedPlanet(
                  neighbor,
                  [lastVisitedPlanet.getLastTravelDay() + dayToReachNeighbor],
                  lastVisitedPlanet.actualAutonomy - dayToReachNeighbor
                );
                // The graph is not oriented, but we can save time by focusing on the arrival
                if (!path.hasPlanet(visitedNeighbor.name)) {
                  // From the previous space path, we create a new space path and add the visited planet which become the last visited neighbor from this path
                  spaceTravelPathTmp.addVisitedPlanet(visitedNeighbor);

                  // If we reach the targeted planet, we keep this path
                  if (arrivalPlanet.name === visitedNeighbor.name) {
                    successfulTravelPaths.push(spaceTravelPathTmp);
                  } else {
                    if (
                      !spaceTravelPathTmp.isPathAlreadyIncludedIn(travelPathsTmp)
                    ) {
                      travelPathsTmp.push(spaceTravelPathTmp);
                    }
                  }
                }
              } else {
                // Otherwise, not enough autonomy: we need to refuel. Refueling updates the last visited planet state
                const newLastVisitedPlanet: VisitedPlanet =
                  _.cloneDeep(lastVisitedPlanet);
                falcon.refuelOn(newLastVisitedPlanet, autonomy);
                spaceTravelPathTmp.replaceVisitedPlanetInPathBy(
                  newLastVisitedPlanet
                );
                if (
                  !spaceTravelPathTmp.isPathAlreadyIncludedIn(travelPathsTmp)
                ) {
                  travelPathsTmp.push(spaceTravelPathTmp);
                }
              }
            }
          });
        });
        // The created paths are now our working set for next iteration
        spaceTravelPaths = travelPathsTmp;
        travelPathsTmp = [];
      }
      this.logger.log(`Found ${successfulTravelPaths.length} path(s) in ${new Date().getTime() - startDate.getTime()}ms`);
    }
    return successfulTravelPaths;
  }

  /**
   * Print a list of space travel paths
   *
   * @param travelPaths {Array}
   * @private
   */
  private printSpaceTravelPaths(travelPaths: SpaceTravelPath[]): void {
    travelPaths.forEach((spaceTravelPath: SpaceTravelPath) => {
      this.logger.log(`${spaceTravelPath.visitedPlanets.map((visitedPlanets: VisitedPlanet) =>
        `Path: [${visitedPlanets.name}] on day(s) : [${visitedPlanets.travelDays.join(", ")}] `).join(" ; ")
      }`);
    });
  }

  /**
   * Compute Odd
   *
   * @param lowestHuntersMetCount {number} The lowest Hunters met count
   * @return {number} returning the odd x  as 0 < x < 1
   * @private
   */
  private computeOdd(lowestHuntersMetCount: number): number {
    let falconBeingCatchProbability = 0;
    for (let k = 0; k < lowestHuntersMetCount; k++) {
      falconBeingCatchProbability += Math.pow(9, k) / Math.pow(10, k + 1);
    }
    return 1 - falconBeingCatchProbability;
  }

  /**
   * Build the space travel root path
   *
   * @param departurePlanet {Planet} Planet of departure
   * @param autonomy        {number}The autonomy
   * @return {SpaceTravelPath}
   * @private
   */
  private getTheSpaceTravelRootPath(departurePlanet: Planet, autonomy: number) {
    const spaceTravelPath: SpaceTravelPath = new SpaceTravelPath();
    const departurePlanetVisited = new VisitedPlanet(
      departurePlanet,
      [0],
      autonomy
    );
    spaceTravelPath.addVisitedPlanet(departurePlanetVisited);
    return spaceTravelPath;
  }
}
