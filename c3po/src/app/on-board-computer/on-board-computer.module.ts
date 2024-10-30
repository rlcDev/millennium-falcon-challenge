import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OnBoardComputerContComponent } from "./components/computer/cont/on-board-computer-cont.component";
import { OnBoardComputerPresComponent } from "./components/computer/cont/pres/on-board-computer-pres.component";
import { OddMissionService } from "./services/odd-mission/odd-mission.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

@NgModule({
  declarations: [
    OnBoardComputerContComponent,
    OnBoardComputerPresComponent
  ],
  exports: [
    OnBoardComputerContComponent,
    OnBoardComputerPresComponent
  ], imports: [CommonModule], providers: [
    OddMissionService,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class OnBoardComputerModule {
}
