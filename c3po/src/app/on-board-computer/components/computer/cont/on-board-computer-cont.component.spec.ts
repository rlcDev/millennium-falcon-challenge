import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OnBoardComputerContComponent } from "./on-board-computer-cont.component";
import { OddMissionService } from "../../../services/odd-mission/odd-mission.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { OnBoardComputerPresComponent } from "./pres/on-board-computer-pres.component";

describe("OnBoardComputerContComponent", () => {
  let component: OnBoardComputerContComponent;
  let fixture: ComponentFixture<OnBoardComputerContComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OnBoardComputerContComponent,
        OnBoardComputerPresComponent
      ],
      providers: [OddMissionService, OddMissionService, provideHttpClient(withInterceptorsFromDi())]
    }).compileComponents();

    fixture = TestBed.createComponent(OnBoardComputerContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
