import { Route } from "@angular/router";

export const Routes: Route[] = [
  {
    path:'',
    loadComponent: () => import('./list/list.component').then(c => c.ListComponent),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  }
]
