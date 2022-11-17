import {Empire} from "../../models/empire.model";
import {HttpClient, HttpResponse, HttpStatusCode} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import {API_BASE} from "../../constants/constants";
import {ApiCode, ApiResponse} from "../../../shared/api-response.model";

@Injectable()
export class OddMissionService {

  constructor(private readonly http: HttpClient) {
  }

  /**
   * Get the odd mission
   * @param formData {FormData} The imported file
   * @return {Observable} of api response
   */
  getOdd(formData: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${API_BASE}/mission/odd`, formData, {observe: "response"})
      .pipe(map((response: HttpResponse<ApiResponse>) => {
        return response.status === HttpStatusCode.Ok ? {
          status: ApiCode.OK,
          value: response.body?.value,
          message: response.body?.message
        } as ApiResponse : {status: ApiCode.KO, value: -1, message: 'error'} as ApiResponse;
      }));
  }

  /**
   * Check an empire
   * The countdown should be positive
   * The planet should be defined and not empty
   * The associated day should be positive and lower than the countdown
   *
   * @param empire {Empire} The empire
   * @return {boolean} state if the given empire is well-formed
   */
  isCorrect(empire: Empire): boolean {
    // The countdown should be defined correct
    if (empire.countdown == null || empire.countdown < 0) {
      return false;
    }

    // The planet and day associated should be defined and have correct values planet not empty
    // Plus the day associated not negative and lower than the countdown
    for (const loc of empire.bounty_hunters) {
      if (!loc.planet || !loc.day || loc.day < 0 || loc.day > empire.countdown) {
        return false;
      }
    }
    return true;
  }
}
