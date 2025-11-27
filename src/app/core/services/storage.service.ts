import { Injectable } from "@angular/core";
import { projectName } from "../../api.constants";

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  setTokens(tokens: {accessToken: string; refreshToken: string; expiryTime: string}) {
    localStorage.setItem(`${projectName}_accessToken`, tokens.accessToken);
    localStorage.setItem(`${projectName}_refreshToken`, tokens.refreshToken);
    localStorage.setItem(`${projectName}_expiryTime`, tokens.expiryTime);
  }

  setValue(data: {key: string; value: string}) {
    localStorage.setItem(`${projectName}_${data.key}`, `${data.value}`);
  }

  getValue(key: string) {
    return localStorage.getItem(`${projectName}_${key}`);
  }

  removeItem(key: string) {
    localStorage.removeItem(`${projectName}_${key}`);
  }

  removeTokens() {
    const tokens = [`${projectName}_accessToken`, `${projectName}_refreshToken`, `${projectName}_expiryTime`];

    tokens.forEach((token: string) => {
      localStorage.removeItem(`${token}`);
    });
  }
}
