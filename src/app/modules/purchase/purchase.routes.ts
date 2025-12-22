import { Route } from "@angular/router";
import { PurchaseListComponent } from "./purchase-list/purchase-list.component";

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
    component: PurchaseListComponent,
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },

]
