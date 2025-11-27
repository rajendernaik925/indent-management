import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { IApiResponse } from '../../core/modals/api-respones';
import { HttpErrorResponse } from '@angular/common/http';
import { CoreService } from '../../core/services/core.services';
import { ITokenData } from '../../core/modals/tokent';
import { IAdmin } from '../../core/modals/admin';
import { SettingsService } from '../../core/services/settings.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {


  logo: string = 'images/indent-logo.png';
  sideImage: string = 'images/side-image.png';


  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private coreService: CoreService = inject(CoreService);
  private settingsService: SettingsService = inject(SettingsService);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    rememberMe: new FormControl(false),
  })

  onSubmit(): void {
    console.log("Login value: ", this.loginForm.value);
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      const email = this.loginForm.value.email?.trim().toLowerCase();
      // if (email === 'manager@gmail.com') {
      //   localStorage.setItem('rightsToAccess', 'manager');
      // } else {
      //   localStorage.setItem('rightsToAccess', 'employee');
      // }

      // if (email === 'manager@gmail.com') {
      //   this.router.navigate(['/manager']);
      // } else {
      //   this.router.navigate(['/employee']);
      // }
      this.router.navigate(['/dashboard']);
      this.coreService.displayToast({
        type: "success",
        message: "Welcome to Indent management Dashboard"
      })
      // this.authService.Login(this.loginForm.value).subscribe({
      //   next: (res: IApiResponse) => {
      //     if (!res.settings.success) {
      //       this.coreService.displayToast({
      //         type: 'error',
      //         message: res.settings.message
      //       })
      //     } else {
      //       const tokens: ITokenData = res.data;
      //       this.coreService.setTokens(tokens);
      //       this.fetchUserDetail();
      //     }

      //   },
      //   error: (err: HttpErrorResponse) => {
      //     this.coreService.displayToast({
      //       type: 'error',
      //       message: err.message
      //     })
      //   }
      // })
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
        control?.markAsDirty();
        control?.updateValueAndValidity();
      });
      this.coreService.displayToast({
        type: "error",
        message: "Please Enter Valid Credentials"
      })
    }
  }

  fetchUserDetail() {
    this.authService.fetchUserDetail().subscribe({
      next: (res: IApiResponse) => {
        if (!res.settings.success) {
          this.coreService.displayToast({
            type: 'error',
            message: res.settings.message,
          });
        } else {
          const adminData: IAdmin = res.data;
          this.settingsService.adminInfo.set(adminData);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.coreService.displayToast({
          type: 'error',
          message: err.message,
        });
      }
    })
  }

}
