import { HunterPosition } from "models/hunter-position.model";

/**
 * Empire modeling
 * - countdown: The countdown before the ultimate weapon reaches the arrival planet: Endor
 * - huntersPositions: Listing where the bounty hunters are at given days
 *
 * @author Laurent
 * @version 1.0
 */
export class Empire {
  private readonly _countdown: number;
  private readonly _huntersPositions: HunterPosition[];

  constructor(
    readonly theCountDown: number,
    readonly theHunterPositions: HunterPosition[]
  ) {
    this._countdown = theCountDown;
    this._huntersPositions = theHunterPositions;
  }

  /**
   * Get the hunters days of presence for a given planet
   *
   * @param currentPlanet {String} current planet name
   * @return {Array} containing the days
   */
  public getHuntersDaysOfPresenceOn(currentPlanet: string): number[] {
    return this.hunterPositions
      .map((position: HunterPosition) => position.planetName)
      .includes(currentPlanet)
      ? this.hunterPositions.find(
        (hunterPosition: HunterPosition) =>
          hunterPosition.planetName === currentPlanet
      ).daysOfPresence
      : [];
  }

  get countdown(): number {
    return this._countdown;
  }

  get hunterPositions(): HunterPosition[] {
    return this._huntersPositions;
  }
}
