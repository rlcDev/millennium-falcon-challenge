import {TestBed} from '@angular/core/testing';

import {OddMissionService} from './odd-mission.service';
import {Empire} from "../../models/empire.model";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('OddMissionService', () => {
  let service: OddMissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OddMissionService]
    });
    service = TestBed.inject(OddMissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should isCorrect return true if the countdown is equal to 0', () => {
    const empire: Empire = {
      countdown: 0,
      bountyHuntersLocalization: []
    }
    expect(service.isCorrect(empire)).toBe(true);
  });

  it('should isCorrect return false if the countdown is negative', () => {
    const empire: Empire = {
      countdown: -1,
      bountyHuntersLocalization: []
    }
    expect(service.isCorrect(empire)).toBeFalse();
  });

  it('should isCorrect return true if the bounty hunters localization is empty', () => {
    const empire: Empire = {
      countdown: 0,
      bountyHuntersLocalization: []
    }
    expect(service.isCorrect(empire)).toBe(true);
  });

  it('should isCorrect return false if any of planet of the bounty hunters localization is empty', () => {
    const empire: Empire = {
      countdown: 10,
      bountyHuntersLocalization: [
        {
          planet: "",
          day: 0
        }, {
          planet: "p",
          day: 1
        }
      ]
    }
    expect(service.isCorrect(empire)).toBeFalse();
  });

  it('should isCorrect return false if any of day associated to a planet of the bounty hunters localization is negative', () => {
    const empire: Empire = {
      countdown: 10,
      bountyHuntersLocalization: [
        {
          planet: "p",
          day: 0
        }, {
          planet: "q",
          day: -1
        }
      ]
    }
    expect(service.isCorrect(empire)).toBeFalse();
  });

  it('should isCorrect return false if any of day associated to a planet of the bounty hunters localization is higher than the countdown', () => {
    const empire: Empire = {
      countdown: 5,
      bountyHuntersLocalization: [
        {
          planet: "p",
          day: 0
        }, {
          planet: "q",
          day: 6
        }
      ]
    }
    expect(service.isCorrect(empire)).toBeFalse();
  });

  it('should isCorrect return true for valid cases', () => {
    const empire: Empire = {
      countdown: 5,
      bountyHuntersLocalization: [
        {
          planet: "p",
          day: 1
        }, {
          planet: "q",
          day: 2
        }
      ]
    }
    expect(service.isCorrect(empire)).toBe(true);
  });

});
