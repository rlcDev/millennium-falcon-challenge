import { Planet } from "models/planet.model";

/**
 * The Galaxy
 * - planets: Listing the planets of the galaxy
 *
 * @author Laurent
 * @version 1.0
 */
export class Galaxy {
  private readonly _planets: Planet[];

  constructor(readonly thePlanets: Planet[]) {
    this._planets = thePlanets;
  }

  /**
   * Does the galaxy contains a given planet
   * @param planetName {string} Planet name
   * @return {boolean} state the existence
   */
  doesContainsPlanet(planetName: string): boolean {
    return this._planets
      .map((planet: Planet) => planet.name)
      .includes(planetName);
  }

  get planets() {
    return this._planets;
  }
}
