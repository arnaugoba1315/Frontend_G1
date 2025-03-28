import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BackOfficeComponent } from './backoffice/backoffice.component';
import { ActivitiesComponent } from './backoffice-activity/backoffice-activity.component';

export const routes: Routes = [
    {   path: 'admin', component: BackOfficeComponent    },
    { path: 'activities', component: ActivitiesComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }