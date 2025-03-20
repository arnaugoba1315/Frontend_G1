import { Routes } from '@angular/router';

import { CollectionComponent } from './components/colletion/colletion.component'; 
import { ElementComponent } from './components/element/element.component';
import { CreateElementComponent } from './components/create-element/create-element.component';

export const routes: Routes = [
  {
    path: 'elements',
    component: CollectionComponent
  },
  {
    path: 'elements/new',
    component: CreateElementComponent
  },
  {
    path: 'elements/new/:id',
    component: CreateElementComponent
  },
  {
    path: 'elements/:id',
    component: ElementComponent
  },
  {
    path: '',
    redirectTo: '/elements',
    pathMatch: 'full'
  }
];
