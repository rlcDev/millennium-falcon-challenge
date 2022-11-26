import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { OnBoardComputerModule } from "./on-board-computer/on-board-computer.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    OnBoardComputerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
