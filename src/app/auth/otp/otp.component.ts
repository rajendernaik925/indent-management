import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone:true,
  imports:[
    CommonModule
  ],
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {

  forgotValue!:boolean;
  otpForm: FormGroup;
  mobileNumber: string = '';
  logo: string = 'images/SKILLOGO.png';

  private router:Router = inject(Router);
  private route:ActivatedRoute = inject(ActivatedRoute)

  constructor(private fb: FormBuilder) {
    this.otpForm = this.fb.group({
      inputs: this.fb.array(['', '', '', '', '', ''])
    });
  }

  ngOnInit(): void {
    this.forgotValue = JSON.parse(this.route.snapshot.paramMap.get('forgotValue') || 'false');
    console.log("Received forgotValue:", this.forgotValue);
    console.log("forgot value in otp :",this.forgotValue)
  }

  moveToNext(currentInput: HTMLInputElement, nextInput?: HTMLInputElement | null): void {
    if (currentInput.value.length > 1) {
      currentInput.value = currentInput.value.slice(0, 1);
    }
    if (currentInput.value.length === 1 && nextInput) {
      setTimeout(() => {
        nextInput.focus();
        nextInput.select();
      }, 0);
    }
  }

  moveToPrevious(currentInput: HTMLInputElement, prevInput?: HTMLInputElement | null): void {
    if (currentInput.value === '' && prevInput) {
      prevInput.focus();
    }
  }

  mergeInputs(input1Value: string, input2Value: string, input3Value: string, input4Value: string, input5Value: string, input6Value: string) {
    const otp = input1Value + '' + input2Value + '' + input3Value + '' + input4Value + '' + input5Value + '' + input6Value;
    const mobileNumber = this.mobileNumber;
    const loginPayload = {
      otp: otp,
      mobileNumber: mobileNumber
    };
    console.log("otp value ",otp)
    if(this.forgotValue) {
      this.router.navigate(['/auth/confirm-reset'])
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

}
