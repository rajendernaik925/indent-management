import { Route } from "@angular/router";
import { EmployeeListComponent } from "./employee-list/employee-list.component";

export const Routes: Route[] = [
  {
    path:'',
    loadComponent: () => import('./employee-list/employee-list.component').then(c => c.EmployeeListComponent),
  },
  {
    path:'detail/:id',
    loadComponent: () => import('./employee-manage/employee-manage.component').then(c => c.EmployeeManageComponent),
  },
  {
      path: '',
      component: EmployeeListComponent,
    },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  }
]
