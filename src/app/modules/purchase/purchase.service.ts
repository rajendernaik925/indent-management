import { CoreService } from "../../core/services/core.services";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { purchaseUrls } from "../../api.constants";

@Injectable({
  providedIn: 'root'
})

export class purchaseService {

  private coreService: CoreService = inject(CoreService);
  private http: HttpClient = inject(HttpClient);

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('API Error:', error);

    let errorMessage = 'Something went wrong. Please try again';

    // Network / CORS error
    if (error.status === 0) {
      errorMessage = 'Unable to connect to server';
    }
    // Backend response
    else if (error.error) {
      // 🔹 CASE 1: Backend sends JSON with message
      if (error.error.message) {
        errorMessage = error.error.message;
      }
      // 🔹 CASE 2: Backend sends plain string
      else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }
      // 🔹 CASE 3: Fallback
      else if (error.message) {
        errorMessage = error.message;
      }
    }

    this.coreService.displayToast({
      type: 'error',
      message: errorMessage   // ✅ ONLY message shown
    });

    return throwError(() => error);
  };



  purchaseRequestList(params: any): Observable<any> {
    return this.http.post(`${purchaseUrls.purchaseList}`, params).pipe(
      catchError(this.handleError),
    );
  }

  removeMaterial(payload: any): Observable<any> {
    return this.http.post(`${purchaseUrls.removeMaterial}`, payload, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  updateIndentStatus(payload: any): Observable<any> {
    return this.http.post(`${purchaseUrls.processIndent}`, payload, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }
}
