import { Component, Input } from "@angular/core";
import { Subject } from "rxjs";
import { OddResponse } from "../../../../models/odd-response.model";

@Component({
  selector: "app-on-board-computer-pres",
  templateUrl: "./on-board-computer-pres.component.html",
  styleUrls: ["./on-board-computer-pres.component.scss"]
})
export class OnBoardComputerPresComponent {

  @Input()
  oddResponse!: OddResponse | null;
  @Input()
  importedFile$!: Subject<File>;

  /**
   * Upload files
   * @param target {EventTarget} files imported
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
}
