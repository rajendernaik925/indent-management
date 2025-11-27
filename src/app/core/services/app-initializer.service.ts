import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SettingsService } from "./settings.service";
import { authUrls } from "../../api.constants";
import { IApiResponse } from "../modals/api-respones";

@Injectable({
  providedIn: "root",
})


export class AppInitializerService {
  private httpClient: HttpClient = inject(HttpClient);
  private settingsService: SettingsService = inject(SettingsService);

  async initializeApp(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<IApiResponse>(authUrls.userDetail).subscribe({
        next: (res: IApiResponse) => {
          this.settingsService.adminInfo.set(res.data);
          resolve(res);
        },
        error: (err: HttpErrorResponse) => {
          reject(err)
        }
      });
    });
  }
}
