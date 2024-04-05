import {inject, NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AdminComponent} from "./admin/admin.component";
import {QuizComponent} from "./quiz/quiz.component";
import {AdminPatientsComponent} from "./admin/pages/patients/admin-patients.component";
import {PatientComponent} from "./admin/pages/patient/patient.component";
import {AdminQuizzComponent} from "./admin/pages/quizz/admin-quizz.component";
import {InformationComponent} from "./admin/pages/patient/information/information.component";
import {StatisticsComponent} from "./admin/pages/patient/statistics/statistics.component";
import {ProfilesComponent} from "./profiles/profiles.component";
import {AccessChecker} from "../service/access-checker.service";
import {AccessRestriction} from "../models/access-restriction.models";

export const checkAccess = (restriction: AccessRestriction) => inject(AccessChecker).canActivate(restriction);

const routes: Routes = [
  {path: "", pathMatch: "full", component: ProfilesComponent},
  {
    path: "admin", component: AdminComponent, canActivate: [() => checkAccess(AccessRestriction.Admin)], children: [
      {path: "", pathMatch: "full", redirectTo: "patients"},
      {path: "patients", component: AdminPatientsComponent},
      {
        path: "patient/:user_id", component: PatientComponent, children: [
          {path: "", pathMatch: "full", redirectTo: "infos"},
          {path: "infos", component: InformationComponent},
          {path: "stats", component: StatisticsComponent}
        ]
      },
      {path: "quizz", component: AdminQuizzComponent}
    ]
  },
  {path: "quiz", component: QuizComponent, canActivate: [() => checkAccess(AccessRestriction.User)]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
