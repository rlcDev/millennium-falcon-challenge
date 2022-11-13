import {Empire} from "../../models/empire.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";

@Injectable()
export class EmpireService {

  constructor(private readonly http: HttpClient) {
  }

  /**
   * Send the uploaded empire
   * @param empire {@link Empire}
   * @return Observable<boolean> based request state
   */
  sendUploadedEmpire(empire: Empire): Observable<boolean> {
    console.log(empire);
    //return this.http.post<boolean>(`${API_BASE}/upload-empire`, empire).pipe(response => response.code === 200);
    return of(true);
  }

  /**
   * Check an empire
   * The countdown should be positive
   * The planet should be defined and not empty
   * The associated day should be positive and lower than the countdown
   *
   * @param empire
   * @return state if the given empire is well-formed
   */
  isCorrect(empire: Empire): boolean {
    // The countdown should be defined correct
    if (empire.countdown == null || empire.countdown < 0) {
      return false;
    }

    // The planet and day associated should be defined and have correct values planet not empty
    // Plus the day associated not negative and lower than the countdown
    for (const loc of empire.bountyHuntersLocalization) {
      if (!loc.planet || !loc.day || loc.day < 0 || loc.day > empire.countdown) {
        return false;
      }
    }
    return true;
  }
}
