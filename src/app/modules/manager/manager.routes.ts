import { Route } from "@angular/router";
import { ListComponent } from "../applied/list/list.component";

export const Routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./manager-list/manager-list.component').then(c => c.ManagerListComponent),
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./manager-manage/manager-manage.component').then(c => c.ManagerManageComponent),
  },
  {
    path: 'employee',
    component: ListComponent,
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  
]
