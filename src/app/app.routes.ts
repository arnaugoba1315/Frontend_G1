import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BackOfficeComponent } from './backoffice/backoffice.component';

export const routes: Routes = [
    {   path: 'admin', component: BackOfficeComponent    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }