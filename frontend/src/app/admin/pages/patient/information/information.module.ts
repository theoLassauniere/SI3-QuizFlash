import {NgModule} from "@angular/core";
import {NgOptimizedImage} from "@angular/common";
import {PatientSettingsComponent} from "../settings/settings.component";
import {SettingsModule} from "../settings/settings.module";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {FormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {PatientComponent} from "../patient.component";

@NgModule({
  declarations: [
    PatientSettingsComponent
  ],
  exports: [
    PatientSettingsComponent
  ],
  imports: [
    NgOptimizedImage,
    SettingsModule,
    NgMultiSelectDropDownModule,
    NgSelectModule,
    FormsModule
  ],
  bootstrap: [
    PatientComponent
  ]
})

export class InformationModule{
}
