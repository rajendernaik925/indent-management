import { Component } from '@angular/core';
import { COMMON_EXPORTS } from '../../core/common-exports.constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mobile-login',
  standalone: true,
  imports: [
    COMMON_EXPORTS
  ],
  templateUrl: './mobile-login.component.html',
  styleUrl: './mobile-login.component.scss'
})
export class MobileLoginComponent {

  logo: string = 'images/SKILLOGO.png';
  loginForm: FormGroup = new FormGroup({
    mobile: new FormControl('',[Validators.required, Validators.minLength(10)])
  })

  onSubmit() {
    console.log("loginform mobile : ",this.loginForm.value)
  }
  sendOTP() {
    console.log("send otp clicked")
  }

}
