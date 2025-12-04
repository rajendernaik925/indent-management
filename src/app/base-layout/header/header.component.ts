import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { CoreService } from '../../core/services/core.services';
import * as bootstrap from 'bootstrap';
import { StorageService } from '../../core/services/storage.service';
import { SettingsService } from '../../core/services/settings.service';

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
  userDetail: any;
  userAccess: any;

  private router: Router = inject(Router);
  private coreService: CoreService = inject(CoreService);
  private storageService: StorageService = inject(StorageService);
  private settingService: SettingsService = inject(SettingsService);

  ngOnInit(): void {
    const employee = this.settingService.employeeInfo();
    this.userDetail = employee;
    const employeeAccess = this.settingService.moduleAccess();
    this.userAccess = employeeAccess;
    console.log("User Detail: ", this.userDetail);
    console.log("User Access: ", this.userAccess); 
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
        this.storageService.clearAll();
        this.router.navigate(['/auth/login']);
        this.coreService.displayToast({
          type: "success",
          message: "Logout Successful!"
        })
      } else {
        const element = document.getElementById('profileOffcanvas');
        if (element) {
          const canvas = bootstrap.Offcanvas.getInstance(element);
          if (canvas) canvas.hide();
        }
      }
    });
  }

  navigateToProfile() {
    const element = document.getElementById('profileOffcanvas');
    if (element) {
      const offcanvas = new bootstrap.Offcanvas(element);
      offcanvas.show();
    }
  }



}
