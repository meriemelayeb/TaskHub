import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home'; 
import { LoginComponent } from '../components/login'; 
import { RegisterComponent } from '../components/signup'; 
import { AdminComponent } from '../components/admin'; 
import { EmployeeComponent } from '../components/employe';
import { DashboardComponent } from '../components/dashboard'; 

export const routes: Routes = [
  // Route par défaut (Page d'accueil)
  { path: '', component: HomeComponent },
  
  // NOUVELLE ROUTE POUR LA CONNEXION
  { path: 'login', component: LoginComponent }, 
  { path: 'signup', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'dashboard', component: DashboardComponent },
  
  // Optionnel : Route pour rediriger toute URL non trouvée vers l'accueil
  { path: '**', redirectTo: '' } 
];