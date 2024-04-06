import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Answer} from "../../../models/answer.models";

@Component({
  selector: 'app-question-result',
  templateUrl: './question-result.component.html',
  styleUrls: ['./question-result.component.scss']
})
export class QuestionResultComponent implements OnInit {
  @Input() goodAnswer?: Answer;

  @Input() set correct(value: boolean) {
    console.log(value);
    if (value) {
      this.text = "Bravo, tu as raison, la bonne réponse était :";
    } else {
      this.text = "Nous réessaierons cette question plus tard, la bonne réponse était :";
    }
  }
  @Output() continue = new EventEmitter<Answer>();
  private timeOutId?: number;
  protected text?: String;

  constructor() {
  }

  ngOnInit(): void {
    this.timeOutId = setTimeout(() => this.nextQuestion(), 60000);
  }

  nextQuestion() {
    this.continue.emit();
    clearTimeout(this.timeOutId);
  }
}
