import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {AdminRoutingModule} from "./admin-routing.module";
import {AdminNavbarComponent} from "./admin-navbar/admin-navbar.component";
import {AdminComponent} from "./admin.component";
import {HeaderComponent} from "../layout/header/header.component";

@NgModule({
  declarations: [
    AdminNavbarComponent,
    AdminComponent,
    HeaderComponent
  ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        NgOptimizedImage
    ]
})
export class AdminModule {
}