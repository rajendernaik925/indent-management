import { CoreService } from "../../core/services/core.services";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { employeeUrls } from "../../api.constants";

@Injectable({
  providedIn: 'root'
})

export class employeeService {

  private coreService: CoreService = inject(CoreService);
  private http: HttpClient = inject(HttpClient);

  // private handleError = (error: HttpErrorResponse): Observable<never> => {
  //   let errorMessage = '';
  //   if (error.status === 0) {
  //     errorMessage = error.message;
  //   } else {
  //     errorMessage = error.error;
  //   }
  //   this.coreService?.displayToast({
  //     type: 'error',
  //     message: `${errorMessage}`,
  //   });
  //   return throwError(() => errorMessage);
  // }

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




  raiseIndentRequest(formData: FormData): Observable<any> {
    return this.http.post(`${employeeUrls.raiseIndentRequest}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  indentRequestList(payload: any): Observable<any> {
    return this.http.post(`${employeeUrls.indentRequestLIst}`, payload).pipe(
      catchError(this.handleError)
    );
  }

  indentDetails(id: any): Observable<any> {
    return this.http.get(`${employeeUrls.indentDetails}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  indentFiles(id: any): Observable<any> {
    return this.http.get(`${employeeUrls.indentFiles}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // indentFiles(id:any): Observable<string> {
  //   return this.http.get(`${employeeUrls.indentFiles}/${id}`, { responseType: 'text' }).pipe(
  //     catchError(this.handleError)
  //   );
  // }


}
