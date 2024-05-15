import {NgModule} from "@angular/core";
import {QuizSelectionComponent} from "./quiz-selection/quiz-selection.component";
import {QuizSelectionCardComponent} from "./quiz-selection/quiz-selection-card/quiz-selection-card.component";
import {LayoutModule} from "../../layout/layout.module";
import {NgForOf} from "@angular/common";
import {QuizGameSelectionComponent} from "./quiz-game-selection.component";

@NgModule({
    declarations: [
      QuizSelectionCardComponent,
      QuizSelectionComponent,
      QuizGameSelectionComponent
    ],
  exports: [
    QuizGameSelectionComponent,
    QuizSelectionComponent
  ],
    imports: [
      LayoutModule,
      NgForOf
    ]
  }
)
export class QuizGameSelectionModule {
}