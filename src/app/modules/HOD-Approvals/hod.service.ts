import { CoreService } from "../../core/services/core.services";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { hodUrls } from "../../api.constants";

@Injectable({
  providedIn: 'root'
})

export class hodService {

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

  hodRequestList(params: any): Observable<any> {
    return this.http.post(`${hodUrls.hodList}`, params).pipe(
      catchError(this.handleError),
    );
  }

  removeMaterial(payload: any): Observable<any> {
    return this.http.post(`${hodUrls.removeMaterial}`, payload, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  updateIndentStatus(payload: any): Observable<any> {
    return this.http.post(`${hodUrls.processIndent}`, payload, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

}
