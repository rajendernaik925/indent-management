import { Route } from "@angular/router";
import { BaseLayoutComponent } from "../base-layout/base-layout.component";

export const Routes: Route[] = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.Routes),
      },
      {
        path: 'manager',
        loadChildren: () => import('./manager/manager.routes').then(m => m.Routes)
      },
      {
        path: 'employee',
        loadChildren: () => import('./employee/employee.routes').then(m => m.Routes)
      },
      {
        path: 'purchase',
        loadChildren: () => import('./purchase/purchase.routes').then(m => m.Routes)
      },
      {
        path: 'hod-approvals',
        loadChildren: () => import('./HOD-Approvals/hod.routes').then(m => m.Routes)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: 'applied',
    loadChildren: () => import('./applied/applied.routes').then(m => m.Routes),
  }
];
