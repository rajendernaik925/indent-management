import { Component, inject } from '@angular/core';
import { COMMON_EXPORTS } from '../../core/common-exports.constants';
import { FormControl, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    COMMON_EXPORTS
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {


  logo: string = 'images/SKILLOGO.png'
  private router: Router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    password: new FormControl('',[Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('',[Validators.required, Validators.minLength(8)]),
  })

  onSubmit() {
    console.log("loginform mobile : ",this.loginForm.value)
    if(this.loginForm.valid) {
      this,this.router.navigate(['/auth/login']);
    }
  }

}
