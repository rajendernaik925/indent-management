import { Route } from "@angular/router";

export const Routes: Route[] = [
  {
    path:'list',
    loadComponent: () => import('./list/list.component').then(c => c.ListComponent),
  },
  {
    path:'manage',
    loadComponent: () => import('./manage/manage.component').then(c => c.ManageComponent),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  }
]
