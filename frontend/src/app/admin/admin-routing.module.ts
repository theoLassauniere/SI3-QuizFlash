import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminPatientsComponent} from "./pages/patients/admin-patients.component";
import {AdminComponent} from "./admin.component";
import {AdminQuizzComponent} from "./pages/quizz/admin-quizz.component";
import {PatientComponent} from "./pages/patient/patient.component";

const routes: Routes = [
  {path: 'patients', component: AdminPatientsComponent},
  {path: 'patient', component: PatientComponent},
  {path: 'quizz', component: AdminQuizzComponent}
];

@NgModule({
  imports: [RouterModule.forChild([{
    path: 'admin',
    component: AdminComponent,
    children: routes
  }])],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
