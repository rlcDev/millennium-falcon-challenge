import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OnBoardComputerContComponent} from './components/computer/cont/on-board-computer-cont.component';
import {OnBoardComputerPresComponent} from './components/computer/cont/pres/on-board-computer-pres.component';
import {EmpireService} from "./services/empire/empire.service";
import {HttpClientModule} from "@angular/common/http";
import {MissionService} from "./services/mission/mission.service";

@NgModule({
  declarations: [
    OnBoardComputerContComponent,
    OnBoardComputerPresComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    EmpireService,
    MissionService
  ],
  exports: [
    OnBoardComputerContComponent,
    OnBoardComputerPresComponent
  ]
})
export class OnBoardComputerModule {
}
