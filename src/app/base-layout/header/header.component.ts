import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { CoreService } from '../../core/services/core.services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'] // Corrected here
})
export class HeaderComponent implements OnInit {


  sideImage: string = 'images/side-image.png';
  logo: string = 'images/indent-logo.png';

  private router: Router = inject(Router);
  private coreService: any = inject(CoreService);

  ngOnInit(): void {

  }

  logout() {
    Swal.fire({
      title: 'Confirm Logout',
      text: 'Are you sure you want to log out of the Indent Management Portal? Any unsaved progress will be lost.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Log Out',
      cancelButtonText: 'Cancel',
      reverseButtons: true,

      // Custom styling to match your design:
      customClass: {
        confirmButton: 'btn btn-success px-4 shadow-none border-0',
        cancelButton: 'btn btn-danger px-4 me-2 shadow-none border-0',
        popup: 'swal2-card-custom'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/auth/login']);
        localStorage.removeItem('rightsToAccess');
        this.coreService.displayToast({
        type: "success",
        message: "Logout Successful!"
      })
      }
    });
  }




}
