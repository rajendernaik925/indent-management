import { inject } from "@angular/core";
import { CanActivateChildFn, Router } from "@angular/router";
import { StorageService } from "../services/storage.service";

export const loginGuard: CanActivateChildFn = (route, state) => {

  const router = inject(Router);
  const storageService = inject(StorageService);
  const accessToken = storageService.getValue('accessToken');
  const expiryTime = storageService.getValue('expiryTime');
  if (!expiryTime || !accessToken) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
}
