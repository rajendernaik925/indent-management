import { Route } from "@angular/router";

export const Routes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(c => c.LoginComponent),
  },
  {
    path:'otp',
    loadComponent: () => import('./otp/otp.component').then(c => c.OtpComponent),
  },
  {
    path:'register',
    loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent)
  },
  {
    path:'mobile-login',
    loadComponent: () => import('./mobile-login/mobile-login.component').then(c => c.MobileLoginComponent),
  },
  {
    path:'reset',
    loadComponent: () => import('./reset-password/reset-password.component').then(c => c.ResetPasswordComponent),
  },
  {
    path:'confirm-reset',
    loadComponent: () => import('./confirm-reset/confirm-reset.component').then(c => c.ConfirmResetComponent),
  },
  {
    path:'forgot',
    loadComponent: () => import('./forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }
]
