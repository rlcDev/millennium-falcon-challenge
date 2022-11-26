import { TestBed } from "@angular/core/testing";

import { OddMissionService } from "./odd-mission.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("OddMissionService", () => {
  let service: OddMissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OddMissionService]
    });
    service = TestBed.inject(OddMissionService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
