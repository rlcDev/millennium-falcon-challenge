/**
 * Planet representing by:
 * - name: Planet name
 * - neighbors: Planet and days to go to it
 *
 * @author Laurent
 * @version 1
 */
export class Planet {
  private readonly _name: string;
  private readonly _neighbors: Map<Planet, number> = new Map<Planet, number>();

  constructor(
    readonly theName: string,
    readonly theNeighbors?: Map<Planet, number>,
  ) {
    this._name = theName;
    if (theNeighbors) {
      this._neighbors = theNeighbors;
    }
  }

  /**
   * Add a new neighbor
   *
   * @param newNeighbor {Planet} Planet
   * @param days        {number} reachable time in days
   */
  addNeighbor(newNeighbor: Planet, days: number): void {
    const isNotANeighbor: boolean =
      Array.from(this._neighbors.keys()).length === 0 ||
      Array.from(this._neighbors.keys()).some(
        (planet: Planet) => newNeighbor.name !== planet.name,
      );
    if (isNotANeighbor) {
      this._neighbors.set(newNeighbor, days);
      newNeighbor.neighbors.set(this, days);
    }
  }

  get name(): string {
    return this._name;
  }

  get neighbors(): Map<Planet, number> {
    return this._neighbors;
  }
}
