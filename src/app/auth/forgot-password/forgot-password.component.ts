import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMON_EXPORTS } from '../../core/common-exports.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    COMMON_EXPORTS
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  logo: string = 'images/SKILLOGO.png'
  forgotValue:boolean = false;
  private router:Router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    mobile: new FormControl('',[Validators.required, Validators.email]),
  })

  onSubmit() {
    this.forgotValue = true;
    console.log("loginform mobile : ",this.loginForm.value);
    if(this.loginForm.valid) {
      console.log("forgot value : ",this.forgotValue)
      this.router.navigate(['/auth/otp', {forgotValue : this.forgotValue}])
    }
  }
  sendOTP() {
    console.log("send otp clicked")
  }

}
