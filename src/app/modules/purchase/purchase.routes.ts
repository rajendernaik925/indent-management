import { Route } from "@angular/router";
import { ListComponent } from "../applied/list/list.component";

export const Routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./purchase-list/purchase-list.component').then(c => c.PurchaseListComponent),
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./purchase-manage/purchase-manage.component').then(c => c.PurchaseManageComponent)
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
