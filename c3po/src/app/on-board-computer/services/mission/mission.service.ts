import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {API_BASE} from "../../constants/constants";
import {Injectable} from "@angular/core";

@Injectable()
export class MissionService {

  constructor(private readonly http: HttpClient) {
  }

  /**
   * Get the mission odd
   * @return Observable<number> percentage representing the success of the mission
   */
  getMissionOdd(): Observable<number> {
    return this.http.get<number>(`${API_BASE}/mission-odd`);
  }
}
