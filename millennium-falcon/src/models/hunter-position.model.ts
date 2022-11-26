/**
 * HunterPosition representing the presence days of the bounty hunters per planet
 * - planetName: The planet name
 * - daysOfPresence: The days of presence
 *
 * @author Laurent
 * @version 1.0
 */
export class HunterPosition {
  private readonly _planetName: string;
  private readonly _daysOfPresence: number[];

  constructor(readonly theName?: string, private readonly theDays?: number[]) {
    if (theName) {
      this._planetName = theName;
    }
    if (theDays) {
      this._daysOfPresence = theDays;
    }
  }

  get planetName(): string {
    return this._planetName;
  }

  get daysOfPresence(): number[] {
    return this._daysOfPresence;
  }
}
