import {TestBed} from '@angular/core/testing';

import {MissionService} from './mission.service';
import {HttpClientModule} from "@angular/common/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('MissionService', () => {
  let service: MissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MissionService]
    });
    service = TestBed.inject(MissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
