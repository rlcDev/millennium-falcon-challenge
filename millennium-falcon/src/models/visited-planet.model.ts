import { Planet } from "models/planet.model";

/**
 * Visited planet class is a planet visited belonging to a path
 * - travelDays: Days the Falcon visits this planet
 * - actualAutonomy: Falcon's Autonomy on this planet
 *
 * @author Laurent
 * @version 1.0
 */
export class VisitedPlanet extends Planet {
  private _travelDays: number[];
  private _actualAutonomy: number;

  constructor(
    thePlanet: Planet,
    theTravelsDays: number[],
    theActualAutonomy: number
  ) {
    super(thePlanet.name, thePlanet.neighbors);
    this._travelDays = theTravelsDays;
    this._actualAutonomy = theActualAutonomy;
  }

  /**
   * Add a travel day
   *
   * @param travelDay {number} The day of the travel
   */
  addTravelDay(travelDay: number): void {
    this.travelDays.push(travelDay);
  }

  /**
   * Last day Falcon visits this planet
   *
   * @return {number} The given day
   */
  getLastTravelDay(): number {
    return Math.max(...this.travelDays);
  }

  get travelDays(): number[] {
    return this._travelDays;
  }

  set travelDays(value: number[]) {
    this._travelDays = value;
  }

  get actualAutonomy(): number {
    return this._actualAutonomy;
  }

  set actualAutonomy(value: number) {
    this._actualAutonomy = value;
  }
}
