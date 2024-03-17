import {Component, OnInit} from '@angular/core';

import {Router} from "@angular/router";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent  implements OnInit{
  private router: Router;

  constructor(defaultRouter: Router){
    this.router = defaultRouter;
    this.router.navigate(["/quiz/question"])
  }

  ngOnInit(): void {
  }
}
