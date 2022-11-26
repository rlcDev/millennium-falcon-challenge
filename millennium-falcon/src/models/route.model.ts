/**
 * Route modeling
 * - origin: The departure
 * - destination: The arrival
 * - travel_time: The time to reach the arrival from the departure
 *
 * @author Laurent
 * @version 1.0
 */
export class Route {
  private _origin: string;
  private _destination: string;
  private _travel_time: number;

  get origin(): string {
    return this._origin;
  }

  set origin(value: string) {
    this._origin = value;
  }

  get destination(): string {
    return this._destination;
  }

  set destination(value: string) {
    this._destination = value;
  }

  get travel_time(): number {
    return this._travel_time;
  }

  set travel_time(value: number) {
    this._travel_time = value;
  }
}
