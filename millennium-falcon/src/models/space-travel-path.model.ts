/**
 * SpaceTravelPath is composed of
 * - visitedPlanets a visited planet
 *
 * @author Laurent
 * @since 1
 */
import {VisitedPlanet} from 'models/visited-planet.model';
import {Empire} from 'models/empire.model';
import _ from 'lodash';

export class SpaceTravelPath {
    private _visitedPlanets: VisitedPlanet[] = [];

    /**
     * Add a visited planet
     *
     * @param visitedPlanet {VisitedPlanet}
     */
    addVisitedPlanet(visitedPlanet: VisitedPlanet): void {
        this.visitedPlanets.push(visitedPlanet);
    }

    /**
     * Get last visitedPlanet for this path
     *
     * @return {VisitedPlanet}
     */
    getLastVisitedPlanet(): VisitedPlanet {
        return this.visitedPlanets.reduce(
            (planetA: VisitedPlanet, planetB: VisitedPlanet) =>
                Math.max(...planetA.travelDays) > Math.max(...planetB.travelDays)
                    ? planetA
                    : planetB,
        );
    }

    /**
     * Replace a visited planet in path by another
     *
     * @param newVisitedPlanet {VisitedPlanet}
     */
    replaceVisitedPlanetInPathBy(newVisitedPlanet: VisitedPlanet): void {
        const pathWithoutOldVisitedPlanet: VisitedPlanet[] =
            this.visitedPlanets.filter(
                (visitedPlanet: VisitedPlanet) =>
                    newVisitedPlanet.name !== visitedPlanet.name,
            );

        if (pathWithoutOldVisitedPlanet.length === this.visitedPlanets.length - 1) {
            pathWithoutOldVisitedPlanet.push(newVisitedPlanet);
            this.visitedPlanets = pathWithoutOldVisitedPlanet;
        }
    }

    /**
     * Compute the count of hunters presence of this path
     *
     * @param empire {Empire} The empire
     * @return {number} count of the hunters presence
     */
    computeHuntersPresenceCount(empire: Empire): number {
        let hunterCounter = 0;
        this.visitedPlanets.forEach((visitedPlanet: VisitedPlanet) => {
            const huntersDaysOfPresenceForPlanet = empire.getHuntersDaysOfPresenceOn(
                visitedPlanet.name,
            );
            if (huntersDaysOfPresenceForPlanet.length > 0) {
                visitedPlanet.travelDays.forEach((day: number) => {
                    if (huntersDaysOfPresenceForPlanet.includes(day)) {
                        hunterCounter++;
                    }
                });
            }
        });
        return hunterCounter;
    }

    /**
     * Create a space travel path with an amount of days added to a visited planet
     *
     * @param visitedPlanetName {String} the given planet name
     * @param days {number}            Amount of days
     * @return {SpaceTravelPath} with the given visited planet shifted
     */
    getShiftedSpaceTravelPath(
        visitedPlanetName: string,
        days: number
    ): SpaceTravelPath {
        const currentVisitedPlanet: VisitedPlanet = this.visitedPlanets.find(
            (visitedPlanet: VisitedPlanet) =>
                visitedPlanetName === visitedPlanet.name,
        );
        if (currentVisitedPlanet) {
            const newCurrentVisitedPlanet: VisitedPlanet =
                _.cloneDeep(currentVisitedPlanet);
            const newTravelDays: number[] = newCurrentVisitedPlanet.travelDays.map(
                (day: number) => day + days,
            );
            newCurrentVisitedPlanet.travelDays = newTravelDays;
            const newSpaceTravelPath = _.cloneDeep(this);
            newSpaceTravelPath.replaceVisitedPlanetInPathBy(newCurrentVisitedPlanet);
            return newSpaceTravelPath;
        }
    }

    /**
     * Check if the current path is listed
     * @param spaceTravelPaths {Array} of space travel paths
     * @return {boolean} stating the inclusion
     */
    public isPathAlreadyIncludedIn(spaceTravelPaths: SpaceTravelPath[]): boolean {
        return spaceTravelPaths.map((path: SpaceTravelPath) => path.getCurrentPathName()).includes(this.getCurrentPathName());
    }

    get visitedPlanets(): VisitedPlanet[] {
        return this._visitedPlanets;
    }

    set visitedPlanets(value: VisitedPlanet[]) {
        this._visitedPlanets = value;
    }

    /**
     * Get the current path name on planet name which is unique
     * @return {string} the path name
     * @private
     */
    private getCurrentPathName(): string {
        return this.visitedPlanets.map((visitedPlanet: VisitedPlanet) => visitedPlanet.name).join();
    }
}
