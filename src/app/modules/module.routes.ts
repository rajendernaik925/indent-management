import { Route } from "@angular/router";
import { BaseLayoutComponent } from "../base-layout/base-layout.component";
import { RoleGuard } from "../core/guards/role.guard";

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
        path: 'applied',
        loadChildren: () => import('./applied/applied.routes').then(m => m.Routes),
      },
      {
        path:'settings',
        loadChildren: () => import('./setting/setting.routes').then(m => m.Routes)
      },
      {
        path:'manager',
        // canActivate: [RoleGuard],
        // data: { expectedRole: 'manager' },
        loadChildren: () => import('./manager/manager.routes').then(m => m.Routes)
      },
      {
        path:'employee',
        // canActivate: [RoleGuard],
        // data: { expectedRole: 'employee' },
        loadChildren: () => import('./employee/employee.routes').then(m => m.Routes)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ]
  }
];
