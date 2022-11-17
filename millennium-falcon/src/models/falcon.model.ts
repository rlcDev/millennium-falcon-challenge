/**
 * Falcon representing the Falcon vessels
 * - autonomy: Falcon's autonomy
 * - departure: Its departure planet name
 * - arrival: Its arrival planet name
 *
 * @author Laurent
 * @version 1
 */
import { VisitedPlanet } from './visited-planet.model';

export class Falcon {
  private readonly _autonomy: number;
  private readonly _departurePlanetName: string;
  private readonly _arrivalPlanetName: string;

  constructor(
    readonly theAutonomy,
    readonly theDeparturePlanetName,
    readonly theArrivalPlanetName,
  ) {
    this._autonomy = theAutonomy;
    this._departurePlanetName = theDeparturePlanetName;
    this._arrivalPlanetName = theArrivalPlanetName;
  }

  /**
   * Refuel Falcon
   *
   * @param visitedPlanet  {VisitedPlanet} the visited planet on which we refuel
   * @param actualAutonomy {number} The autonomy
   */
  refuelOn(visitedPlanet: VisitedPlanet, autonomy: number): void {
    visitedPlanet.actualAutonomy =
      visitedPlanet.actualAutonomy + autonomy;
    visitedPlanet.addTravelDay(visitedPlanet.getLastTravelDay() + 1);
  }

  get autonomy() {
    return this._autonomy;
  }

  get departurePlanetName() {
    return this._departurePlanetName;
  }

  get arrivalPlanetName() {
    return this._arrivalPlanetName;
  }
}
