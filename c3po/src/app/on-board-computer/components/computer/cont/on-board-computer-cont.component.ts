import { Component, OnDestroy, OnInit } from "@angular/core";
import { OddMissionService } from "../../../services/odd-mission/odd-mission.service";
import { Subject, Subscription } from "rxjs";
import { OddResponse } from "../../../models/odd-response.model";

@Component({
  selector: "app-on-board-computer-cont",
  templateUrl: "./on-board-computer-cont.component.html"
})
export class OnBoardComputerContComponent implements OnInit, OnDestroy {

  importedFile$: Subject<File> = new Subject<File>();
  oddResponse: OddResponse | null = null;
  private subscriptions: Subscription[] = [];

  constructor(private readonly oddMissionService: OddMissionService) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.importedFile$.subscribe((file: File) => {
        const formData: FormData = new FormData();
        formData.append("file", file);
        this.oddMissionService.getOdd(formData).subscribe({
          next: (response: OddResponse) => this.oddResponse = response,
          error: (e) => this.oddResponse = e.error as OddResponse
        });
      }));
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach(
        (s: Subscription) => s.unsubscribe());
    }
  }
}
