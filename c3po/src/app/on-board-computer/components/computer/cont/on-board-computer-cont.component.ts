import {Component, OnDestroy, OnInit} from '@angular/core';
import {OddMissionService} from "../../../services/odd-mission/odd-mission.service";
import {Observable, Subject, Subscription} from "rxjs";
import {
  DATA_INTEGRITY_ISSUE,
  Empire,
  FORMAT_ISSUE, IMPORT_ISSUE
} from "../../../models/empire.model";
import {ImportFeedback} from "../../../models/import-feedback.model";
import {ApiCode, ApiResponse} from "../../../../shared/api-response.model";

@Component({
  selector: 'app-on-board-computer-cont',
  templateUrl: './on-board-computer-cont.component.html'
})
export class OnBoardComputerContComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private fileReader: FileReader = new FileReader();

  importedFile$: Subject<File> = new Subject<File>();
  importedResult$: Subject<ImportFeedback> = new Subject<ImportFeedback>();
  odd: number = -1;

  constructor(private readonly oddMissionService: OddMissionService) {
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
   * In case the empire is not correct the just send a feedback and prevent a backend call
   *
   * @param loadedEmpire {string} Current imported empire
   * @private
   */
  private processEmpire(loadedEmpire: string): void {
    try {
      const currentEmpire: Empire = JSON.parse(loadedEmpire);
      if (this.oddMissionService.isCorrect(currentEmpire)) {
        const formData: FormData = new FormData();
        formData.append('file', loadedEmpire);
        this.oddMissionService.getOdd(formData).subscribe((response: ApiResponse) => {
          if (response.status === ApiCode.OK) {
            this.importedResult$.next({success: true, message: loadedEmpire})
            this.odd = response.value * 100;
          }
        })
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
