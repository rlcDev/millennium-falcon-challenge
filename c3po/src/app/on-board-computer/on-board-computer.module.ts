import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OnBoardComputerContComponent} from './components/computer/cont/on-board-computer-cont.component';
import {OnBoardComputerPresComponent} from './components/computer/cont/pres/on-board-computer-pres.component';
import {OddMissionService} from "./services/odd-mission/odd-mission.service";
import {HttpClientModule} from "@angular/common/http";

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
    OddMissionService,
  ],
  exports: [
    OnBoardComputerContComponent,
    OnBoardComputerPresComponent
  ]
})
export class OnBoardComputerModule {
}
