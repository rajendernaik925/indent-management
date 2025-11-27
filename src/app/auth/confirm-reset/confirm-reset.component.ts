import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-reset',
  standalone: true,
  imports: [],
  templateUrl: './confirm-reset.component.html',
  styleUrl: './confirm-reset.component.scss'
})
export class ConfirmResetComponent {


  logo: string = 'images/SKILLOGO.png'
  private router:Router = inject(Router);
  confirm() {
    this.router.navigate(['/auth/reset-password'])
  }

}
