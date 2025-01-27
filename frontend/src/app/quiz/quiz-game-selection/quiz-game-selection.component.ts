import {Component, EventEmitter, Output} from "@angular/core";
import {Quiz} from "../../../models/quiz.models";
import {QuizService} from "../../../service/quiz-service.service";
import {UserService} from "../../../service/user.service";
import {Patient} from "../../../models/patient.models";
import {ActivatedRoute, Router} from "@angular/router";
import {UtilsService} from "../../../service/utils.service";


@Component({
  selector: "app-quiz-game-selection",
  templateUrl: "./quiz-game-selection.component.html",
  styleUrls: ["./quiz-game-selection.component.scss"]
})
export class QuizGameSelectionComponent {
  public filter: string = "interest";
  public tags: string[] = [];
  public search: string = "";
  public filteredQuizzes?: Quiz[];
  public loading: boolean = false;

  public user?: Patient;
  public quizzes?: Quiz[];
  @Output() returnIdQuizSelected: EventEmitter<String> = new EventEmitter<String>();

  constructor(private userService: UserService, private quizService: QuizService, private utilsService: UtilsService, private route: ActivatedRoute, private router: Router) {
    this.userService.user$.subscribe(user => this.user = user as Patient);
    this.utilsService.getTags().then(values => {
      this.tags = [...new Set(values)];
    }).catch(() => {
      alert("Il y a eu une erreur lors de la récupération des différents hobbies\nVeuillez recharger la page");
    });
    quizService.quizzes$.subscribe(quizzes => {
      this.quizzes = quizzes;
      if (quizzes) this.updateQuizzes();
      else this.filteredQuizzes = undefined;
    });
  }

  playQuiz(quizId: string) {
    this.loading = true;
    this.quizService.startQuiz(quizId).then(() => this.router.navigate(["quiz", quizId], {relativeTo: this.route}).then());
  }

  updateQuizzes() {
    this.filteredQuizzes = this.quizzes?.filter(quiz => {
      if (!quiz.title.toLowerCase().includes(this.search.toLowerCase())) return false;
      switch (this.filter) {
        case "all":
          break;
        case "interest":
          if (!quiz.tags.some(tag => this.user?.hobbies?.includes(tag))) return false;
          break;
        default:
          if (!quiz.tags.some(tag => tag == this.filter)) return false;
          break;
      }
      return true;
    });
  }
}
