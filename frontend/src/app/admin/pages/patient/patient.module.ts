import {NgModule} from '@angular/core';
import {PatientComponent} from "./patient.component";
import {PatientHeaderComponent} from "./header/patient-header.component";
import {BoxedContainerComponent} from "./boxed-container/boxed-container.component";
import {NgOptimizedImage} from "@angular/common";
import {StatisticsComponent} from "./statistics/statistics.component";
import {InformationComponent} from "./information/information.component";
import {StatisticsModule} from "./statistics/statistics.module";
import {InformationModule} from "./information/information.module";
import {PatientNavbarComponent} from "./navbar/patient-navbar.component";
import {RouterLink, RouterOutlet} from "@angular/router";


@NgModule({
  declarations: [
    PatientComponent,
    PatientHeaderComponent,
    BoxedContainerComponent,
    StatisticsComponent,
    InformationComponent,
    PatientNavbarComponent
  ],
  imports: [
    NgOptimizedImage,
    StatisticsModule,
    InformationModule,
    RouterOutlet,
    RouterLink
  ]
})

export class PatientModule {
}
