import { Route } from "@angular/router";
import { HodListComponent } from "./hod-list/hod-list.component";

export const Routes: Route[] = [
  {
    path:'',
    loadComponent: () => import('./hod-list/hod-list.component').then(c => c.HodListComponent),
  },
  {
    path:'detail/:id',
    loadComponent: () => import('./hod-manage/hod-manage.component').then(c => c.HodManageComponent),
  },
  {
      path: '',
      component: HodListComponent,
    },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  }
]
