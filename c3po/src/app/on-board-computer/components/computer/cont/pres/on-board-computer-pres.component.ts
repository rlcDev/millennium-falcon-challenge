import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs";
import {FeedbackStatus} from "../../../../../shared/feedback-status.model";

@Component({
  selector: 'app-on-board-computer-pres',
  templateUrl: './on-board-computer-pres.component.html',
  styleUrls: ['./on-board-computer-pres.component.scss']
})
export class OnBoardComputerPresComponent implements OnInit, OnDestroy {

  @Input()
  missionOdd$!: Observable<number>;
  @Input()
  importedResult$!: Subject<FeedbackStatus>;
  @Input()
  importedFile$!: Subject<File>;

  private subscriptions: Subscription[] = [];
  importEmpireStatus!: FeedbackStatus | null;


  odd: number = -1;

  constructor() {
  }

  ngOnInit(): void {
    //this.missionOdd$.subscribe((o: number) => this.odd = o);
    this.subscriptions.push(this.importedResult$.subscribe((status: FeedbackStatus) => this.importEmpireStatus = status));
  }

  /**
   * Import files
   * @param target files imported
   */
  import(target: EventTarget | null): void {
    const currentTarget = target as HTMLInputElement;
    if (currentTarget && currentTarget?.files) {
      const files: FileList = currentTarget.files;
      if (files && files.length === 1) {
        this.importedFile$.next(files[0]);
      }
    }
    this.odd++;
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
    }
  }
}
