import { Routes } from '@angular/router';
import { HomeComponent } from './frontend/home/home.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },  // Página principal
  { path: 'admin', component: DashboardComponent },  // Backoffice
  { path: '**', redirectTo: '' }  // Redirigir a Home si la ruta no existe
];

