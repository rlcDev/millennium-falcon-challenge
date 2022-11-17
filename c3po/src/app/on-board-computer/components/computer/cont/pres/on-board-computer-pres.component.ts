import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs";
import {ApiCode, ApiResponse} from "../../../../../shared/api-response.model";
import {ImportFeedback} from "../../../../models/import-feedback.model";

@Component({
  selector: 'app-on-board-computer-pres',
  templateUrl: './on-board-computer-pres.component.html',
  styleUrls: ['./on-board-computer-pres.component.scss']
})
export class OnBoardComputerPresComponent implements OnInit, OnDestroy {

  @Input()
  odd!: number;
  @Input()
  importedResult$!: Subject<ImportFeedback>;
  @Input()
  importedFile$!: Subject<File>;

  private subscriptions: Subscription[] = [];
  importEmpireStatus!: ImportFeedback | null;

  constructor() {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.importedResult$.subscribe((status: ImportFeedback) => this.importEmpireStatus = status));
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
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
    }
  }
}
