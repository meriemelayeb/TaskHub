import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from '../components/home';
import { LoginComponent } from '../components/login';
import { RegisterComponent } from '../components/signup';
import { routes } from './app.routes';
import { AdminComponent } from '../components/admin';
import { EmployeeComponent } from '../components/employe';
import { DashboardComponent } from '../components/dashboard';

@NgModule({
  declarations: [
    // SEULEMENT si tes composants ne sont PAS standalone 
    // Si ils sont standalone, NE PAS mettre ici.
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),

    // Si tes composants sont standalone :
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    EmployeeComponent,
    DashboardComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
