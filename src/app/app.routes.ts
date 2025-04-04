import { Routes } from '@angular/router';
import { BackOfficeComponent } from './backoffice/backoffice.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: BackOfficeComponent },
  { path: 'user-home', component: UserHomeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirección por defecto al login
  { path: '**', redirectTo: '/login' } // Redirección para rutas no encontradas
];