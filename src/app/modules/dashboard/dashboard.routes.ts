import { Route } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { ManageComponent } from "./manage/manage.component";

export const Routes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'manage/:id',
    component: ManageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
]
