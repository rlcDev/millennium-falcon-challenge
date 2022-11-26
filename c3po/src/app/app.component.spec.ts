import { TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { OnBoardComputerModule } from "./on-board-computer/on-board-computer.module";

describe("AppComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnBoardComputerModule],
      declarations: [AppComponent]
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
