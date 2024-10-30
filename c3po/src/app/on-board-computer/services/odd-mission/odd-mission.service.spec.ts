import { TestBed } from "@angular/core/testing";
import { OddMissionService } from "./odd-mission.service";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("OddMissionService", () => {
  let service: OddMissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OddMissionService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(OddMissionService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
