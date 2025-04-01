// app.routes.ts actualizado
import { Routes } from '@angular/router';
import { BackOfficeComponent } from './backoffice/backoffice.component';
import { ActivitiesComponent } from './backoffice-activity/backoffice-activity.component';
import { ActivityHistoryComponent } from './activity-history/activity-history.component';

export const routes: Routes = [
    { path: 'admin', component: BackOfficeComponent },
    { path: 'activities', component: ActivitiesComponent },
    { path: 'activity-history', component: ActivityHistoryComponent },
    { path: 'activity-history/:id', component: ActivityHistoryComponent },
    //{ path: '', redirectTo: '/admin', pathMatch: 'full' }
];