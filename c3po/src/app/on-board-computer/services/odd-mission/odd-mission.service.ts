import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { OddResponse } from "../../models/odd-response.model";

@Injectable()
export class OddMissionService {

  MISSION_ODD_PATH = "/mission/odd";

  constructor(private readonly http: HttpClient) {
  }

  /**
   * Get the odd mission for
   * @param formData {FormData} The imported file
   * @return {Observable} the response
   */
  getOdd(formData: FormData): Observable<OddResponse> {
    return this.http.post<OddResponse>(`${environment.apiUrl}${this.MISSION_ODD_PATH}`, formData);
  }
}
