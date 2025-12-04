import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { IApiResponse } from '../../core/modals/api-respones';
import { IAdmin } from '../../core/modals/admin';
// import { ITokenData } from '../../core/modals/tokent';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
// import { SettingsService } from '../../core/services/settings.service';
import { CoreService } from '../../core/services/core.services';
import { COMMON_EXPORTS } from '../../core/common-exports.constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    COMMON_EXPORTS
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {


  logo: string = '/images/register.png';
  rightLogo:string = '/images/LoginLogo.png'

  private router: Router = inject(Router);
  private authService:AuthService = inject(AuthService);
  private coreService:CoreService = inject(CoreService);
  // private settingsService: SettingsService = inject(SettingsService);

  loginForm: FormGroup = new FormGroup({
    firstName: new FormControl('',[Validators.required]),
    lastName: new FormControl('',[Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobile:new FormControl('',[Validators.required, Validators.minLength(10)]),
    password:new FormControl('', [Validators.required, Validators.minLength(8)]),
    gender: new FormControl('',[Validators.required])
  })

  ngOnInit(): void {}

  onSubmit(): void {
    console.log("Login value: ", this.loginForm.value);
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.authService.Login(this.loginForm.value).subscribe({
        next: (res:IApiResponse) => {
          if(!res.settings.success) {
            this.coreService.displayToast({
              type:'error',
              message:res.settings.message
            })
          } else {
            this.router.navigate(['/auth/otp']);
          }
        },
        error: (err:HttpErrorResponse) => {
          this.coreService.displayToast({
            type:'erroe',
            message:err.message
          })
        }
      })
    } else {
      this.coreService.displayToast({
        type:"error",
        message:"Hey Babu....! Above fields are not empty"
      })
    }
  }

}
