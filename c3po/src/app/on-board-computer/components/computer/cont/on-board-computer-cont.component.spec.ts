import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OnBoardComputerContComponent} from './on-board-computer-cont.component';
import {EmpireService} from "../../../services/empire/empire.service";
import {MissionService} from "../../../services/mission/mission.service";
import {HttpClientModule} from "@angular/common/http";

describe('OnBoardComputerContComponent', () => {
  let component: OnBoardComputerContComponent;
  let fixture: ComponentFixture<OnBoardComputerContComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [OnBoardComputerContComponent],
      providers: [EmpireService, MissionService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OnBoardComputerContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
