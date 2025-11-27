import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { authUrls } from "../api.constants";
import { catchError, Observable, throwError } from "rxjs";
import { CoreService } from "../core/services/core.services";
import { IApiResponse } from "../core/modals/api-respones";

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private coreService: CoreService = inject(CoreService);
  private http: HttpClient = inject(HttpClient);

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = '';
    if (error.status === 0) {
      errorMessage = error.message;
    } else {
      errorMessage = error.error;
    }
    this.coreService?.displayToast({
      type: 'error',
      message: `${errorMessage}`,
    });
    return throwError(() => errorMessage);
  }

  Login(data: any = {}): Observable<any> {
    return this.http.post<IApiResponse>(`${authUrls.login}`, data).pipe(
      catchError(this.handleError),
    );
  }

  fetchUserDetail(): Observable<any> {
    return this.http.get(`${authUrls.userDetail}`).pipe(
      catchError(this.handleError),
    );
  }

}
