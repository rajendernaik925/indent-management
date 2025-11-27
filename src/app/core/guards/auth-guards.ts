import { inject } from "@angular/core";
import { CanActivateChildFn, Router } from "@angular/router";
import { StorageService } from "../services/storage.service";

export const authGuard: CanActivateChildFn = (route, state) => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  const accessToken = storageService.getValue('accessToken');
  const expiryTime = storageService.getValue('expiryTime');

  // Bypass guard for 'register' route
  const url = state.url;
  if (url === '/register') {
    return true;
  }

  // OTP Validation logic for other routes
  if (expiryTime && (Number(expiryTime) > Date.now())) {
    if (accessToken && accessToken.length) {
      return true; 
      
    } else {
      console.log('Removing tokens due to missing access token');
      storageService.removeTokens();
      router.navigateByUrl('/auth');  // Redirect to auth page
      return false;
    }
  } else {
    console.log('Removing tokens due to expired session');
    storageService.removeTokens();
    router.navigateByUrl('/auth');
    return false;
  }
}
