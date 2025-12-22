import { CoreService } from "../core/services/core.services";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { commonUrls } from "../api.constants";

@Injectable({
  providedIn: 'root'
})

export class commonService {

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

  indentDetails(id: any): Observable<any> {
    return this.http.get(`${commonUrls.indentDetails}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  indentFiles(id: any): Observable<any> {
    return this.http.get(`${commonUrls.indentFiles}/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  // raiseIndentRequest(formData: FormData): Observable<string> {
  //   return this.http.post(`${employeeUrls.raiseIndentRequest}`, formData, { responseType: 'text' }).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
