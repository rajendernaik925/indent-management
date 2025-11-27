import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { IToastInterface } from '../modals/toast';
import { ITokenData } from '../modals/tokent';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  private showToast$: BehaviorSubject<IToastInterface> = new BehaviorSubject({type: '', message: ''});
  showToast = this.showToast$.asObservable();
  private storageService: StorageService = inject(StorageService);

  displayToast(data = { type: "", message: "" }) {
    this.showToast$.next(data);
  }

  setTokens(data: ITokenData) {
    const tokens = {
      accessToken: 'null',
      refreshToken: 'null',
      expiryTime: 'null',
    };
    if (data?.access) {
      tokens.accessToken = data.access;
    }
    if (data?.refresh) {
      tokens.refreshToken = data.refresh;
    }
    if (data?.expiry_time) {
      tokens.expiryTime = `${data.expiry_time}`;
    }
    this.storageService.setTokens(tokens);
  }
}
