import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Quiz} from "../../../../../models/quiz.models";
import {QuizService} from "../../../../../service/quiz-service.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LayoutModule} from "../../../../layout/layout.module";
import {AdminQuestionsComponent} from "./questions/admin-questions.component";
import {faAdd} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Question} from "../../../../../models/question.models";
import {Answer} from "../../../../../models/answer.models";
import {QuestionType} from "../../../../../models/question-type.models";
import {NgIf} from "@angular/common";

@Component({
  selector: "app-admin-quiz",
  templateUrl: "./admin-quiz.component.html",
  styleUrl: "./admin-quiz.component.scss",
  imports: [
    ReactiveFormsModule,
    LayoutModule,
    AdminQuestionsComponent,
    FaIconComponent,
    NgIf
  ],
  standalone: true
})
export class AdminQuizComponent {
  public quiz?: Quiz;

  quizForm: FormGroup = new FormGroup({
    title: new FormControl("", [Validators.required]),
    theme: new FormControl("", [Validators.required]),
    thumbnailUrl: new FormControl("")
  });

  constructor(public quizService: QuizService, private route: ActivatedRoute, private router: Router) {
    this.quizService.quiz$.subscribe(quiz => {
      this.quiz = quiz;
      this.quizForm.setValue({
        title: this.quiz?.title ?? "",
        theme: this.quiz?.theme ?? "",
        thumbnailUrl: this.quiz?.thumbnailUrl ?? ""
      });
    });
    this.route.params.subscribe(params => {
      let id = params["quiz_id"];
      this.quizService.selectQuiz(id);
    });
  }

  save() {
    if (this.quizForm.valid) {
      if (this.quiz) {
        let quiz = Object.assign({}, this.quiz, this.quizForm.value);
        console.log(quiz);
        return this.quizService.updateQuiz(this.quiz.id, quiz);
      }
      let id = this.quizService.addQuiz(this.quizForm.value);
      this.router.navigate([id], {relativeTo: this.route}).then();
    }
  }

  addQuestion() {
    if (!this.quiz) return;
    this.quiz.questions.push({answers: [{} as Answer, {} as Answer, {} as Answer, {} as Answer], type: QuestionType.TextOnly} as Question);
  }

  protected readonly faAdd = faAdd;
}
