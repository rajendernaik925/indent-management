import { CoreService } from "../../core/services/core.services";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { moduleUrls } from '../../api.constants';
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class appliedService {

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

  getClinics(params: any): Observable<any> {
    return this.http.get(`${moduleUrls.clinicList}`, { params }).pipe(
      catchError(this.handleError),
    );
  }

  addClinic(data: any = {}): Observable<any> {
    return this.http.post(`${moduleUrls.clinicList}`, data).pipe(
      catchError(this.handleError),
    );
  }

  updateClinic(clinicId: string, data: any = {}): Observable<any> {
    return this.http.put(`${moduleUrls}/${clinicId}`, data).pipe(
      catchError(this.handleError),
    );
  }
}
