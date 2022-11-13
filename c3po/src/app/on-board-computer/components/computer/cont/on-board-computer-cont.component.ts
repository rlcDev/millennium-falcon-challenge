import {Component, OnDestroy, OnInit} from '@angular/core';
import {EmpireService} from "../../../services/empire/empire.service";
import {MissionService} from "../../../services/mission/mission.service";
import {Observable, Subject, Subscription} from "rxjs";
import {
  BOUNTY_HUNTERS_CODE_KEY,
  BOUNTY_HUNTERS_INSTRUCTION_KEY, DATA_INTEGRITY_ISSUE,
  Empire,
  FORMAT_ISSUE, IMPORT_ISSUE, SENDING_ISSUE
} from "../../../models/empire.model";
import {FeedbackStatus} from "../../../../shared/feedback-status.model";

@Component({
  selector: 'app-on-board-computer-cont',
  templateUrl: './on-board-computer-cont.component.html'
})
export class OnBoardComputerContComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private fileReader: FileReader = new FileReader();

  missionOdd$: Observable<number> = this.missionService.getMissionOdd();
  importedFile$: Subject<File> = new Subject<File>();
  importedResult$: Subject<FeedbackStatus> = new Subject<FeedbackStatus>();

  constructor(private readonly empireService: EmpireService, private readonly missionService: MissionService) {
  }

  ngOnInit(): void {
    this.fileReader.addEventListener("loadend", (evt) => {
      this.processEmpire(this.fileReader.result as string);
    });

    this.fileReader.addEventListener("error", (evt) => {
      this.importedResult$.next({success: false, message: IMPORT_ISSUE});
    });

    this.subscriptions.push(
      this.importedFile$.subscribe((file: File) => {
        this.fileReader.readAsText(file);
      })
    );
  }

  /**
   * Process empire will check the integrity of the provided empire
   * If the empire is correct we will send the empire for processing and return it for the user experience
   *
   * In case the empire is not correct the just send a feedback
   *
   * @param importedEmpire Current imported empire
   * @private
   */
  private processEmpire(importedEmpire: string): void {
    // This is a design choice to respect convention names (from instruction, code convention)
    const adaptedEmpire: string = importedEmpire.replace(BOUNTY_HUNTERS_INSTRUCTION_KEY, BOUNTY_HUNTERS_CODE_KEY);
    try {
      const currentEmpire: Empire = JSON.parse(adaptedEmpire);
      if (this.empireService.isCorrect(currentEmpire)) {
        this.subscriptions.push(
          this.empireService.sendUploadedEmpire(currentEmpire).subscribe((res: boolean) => {
              this.importedResult$.next(res ? {success: true, message: importedEmpire} : {
                success: false,
                message: SENDING_ISSUE
              });
            }
          )
        );
      } else {
        this.importedResult$.next({success: false, message: DATA_INTEGRITY_ISSUE});
      }
    } catch (error) {
      this.importedResult$.next({success: false, message: FORMAT_ISSUE});
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
    }
  }
}
