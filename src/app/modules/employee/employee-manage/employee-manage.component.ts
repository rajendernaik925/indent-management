import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from '../../../core/services/core.services';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'bootstrap';
import { employeeService } from '../employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { SettingsService } from '../../../core/services/settings.service';
import Swal from 'sweetalert2';
import { commonService } from '../../common.service';

@Component({
  selector: 'app-employee-manage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // SharedModule   
  ],
  templateUrl: './employee-manage.component.html',
  styleUrl: './employee-manage.component.scss'
})
export class EmployeeManageComponent implements OnInit, AfterViewInit {


  Id: number | null = null;
  isEdit: boolean = false;
  indentDetailsData: any;
  userDetail: any;
  userId: any;
  userAccess: any;  
  pdfFiles: { name: string; url: string }[] = [];
  selectedFileUrl: any = null; // For iframe display
  showPDF = false;
  selectedFileIndex: number = 0;
  writeAccess: boolean = false;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);
  private employeeService: employeeService = inject(employeeService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private settingService: SettingsService = inject(SettingsService);
  private commonService: commonService = inject(commonService);


  ngOnInit() {
    const encodedId = this.route.snapshot.paramMap.get('id');
    if (encodedId) {
      const decodedOnce = atob(encodedId);
      const decodedTwice = atob(decodedOnce);
      this.Id = Number(decodedTwice);
      console.log('Final Decoded ID:', this.Id);
    }
    const employee = this.settingService.employeeInfo();
    this.userDetail = employee;
    this.userId = this.userDetail?.id
    const employeeAccess = this.settingService.moduleAccess();
    this.userAccess = employeeAccess;

    const employeeModule = this.userAccess.find(
      (m: { moduleId: number }) => m.moduleId === 2
    );
     this.writeAccess = employeeModule ? employeeModule.canWrite === true : false;
    console.log('Employee module write access:', this.writeAccess);
    this.indentDetails();
  }


  ngAfterViewInit() {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl: any) => {
      new Tooltip(tooltipTriggerEl);
    });
  }

  indentDetails() {
    this.commonService.indentDetails(this.Id).subscribe({
      next: (res: any) => {
        console.log("indent details : ", res);
        const parsedRes = typeof res === 'string' ? JSON.parse(res) : res;
        this.indentDetailsData = parsedRes;
      },
      error: (err: HttpErrorResponse) => {
        console.log("error : ", err)
      }
    })
  }

  back() {
    window.history.back();
  }

  viewFile() {
    this.commonService.indentFiles(this.Id).subscribe({
      next: (res: any) => {
        this.pdfFiles = Object.keys(res).map(key => ({
          name: key,
          url: res[key]
        }));

        if (this.pdfFiles.length > 0) {
          // convert base64 to blob URL
          const byteCharacters = atob(this.pdfFiles[0].url);
          const byteNumbers = new Array(byteCharacters.length)
            .fill(0)
            .map((_, i) => byteCharacters.charCodeAt(i));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });

          this.selectedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(blob)
          );
          this.showPDF = true;
        }
      },
      error: () => {
        this.coreService.displayToast({
          type: 'error',
          message: 'Failed to load files'
        });
      }
    });
  }

  // When radio changes
  onFileChange(index: number) {
    const file = this.pdfFiles[index].url;
    const byteCharacters = atob(file);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    this.selectedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(blob)
    );
    this.selectedFileIndex = index;
  }


  // Close overlay
  closePDF() {
    this.showPDF = false;
  }



  removeMaterial(id: any) {
    Swal.fire({
      title: 'Enter your comments',
      input: 'textarea',
      inputPlaceholder: 'Type your comments here...',
      inputAttributes: {
        maxlength: '500', // max 500 characters
        minlength: '2',   // min 2 characters (validation in inputValidator)
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Comments cannot be empty';
        }
        if (value.length < 2) {
          return 'Minimum 2 characters required';
        }
        if (value.length > 500) {
          return 'Maximum 500 characters allowed';
        }
        return null;
      },
      customClass: {
        popup: 'swal2-popup-custom' // optional: for extra styling
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const payload = {
          materialId: id,
          userId: this.userId,
          comments: result.value
        };

        console.log('Payload:', payload);

        // Call API
        this.employeeService.removeMaterial(payload).subscribe({
          next: (res: any) => {
            this.coreService.displayToast({
              type: 'success',
              message: res
            });
            this.indentDetails();
          },
          // error: (err: any) => {
          //   this.coreService.displayToast({
          //     type: 'error',
          //     message: 'Something went wrong'
          //   });
          // }
        });
      }
    });
  }






}
