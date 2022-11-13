import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OnBoardComputerPresComponent} from './on-board-computer-pres.component';

describe('OnBoardComputerPresComponent', () => {
  let component: OnBoardComputerPresComponent;
  let fixture: ComponentFixture<OnBoardComputerPresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnBoardComputerPresComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OnBoardComputerPresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
