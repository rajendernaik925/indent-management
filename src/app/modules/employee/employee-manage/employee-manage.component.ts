import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from '../../../core/services/core.services';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'bootstrap';
import { employeeService } from '../employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SafeUrlPipe } from '../../../shared/pipes/safe-url.pipe';
import { SharedModule } from '../../../shared/shared-modules';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);
  private employeeService: employeeService = inject(employeeService);
  private sanitizer: DomSanitizer = inject(DomSanitizer)


  ngOnInit() {
    const encodedId = this.route.snapshot.paramMap.get('id');
    if (encodedId) {
      const decodedOnce = atob(encodedId);
      const decodedTwice = atob(decodedOnce);
      this.Id = Number(decodedTwice);
      console.log('Final Decoded ID:', this.Id);
    }
    this.indentDetails();
  }


  ngAfterViewInit() {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl: any) => {
      new Tooltip(tooltipTriggerEl);
    });
  }

  indentDetails() {
    this.employeeService.indentDetails(this.Id).subscribe({
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



  pdfFiles: { name: string; url: string }[] = [];
  selectedFileUrl!: SafeResourceUrl;

  viewFile() {
    this.coreService.displayToast({
      type: 'success',
      message: 'Fetching files...'
    });

    this.employeeService.indentFiles(this.Id).subscribe({
      next: (res: any) => {
        console.log('file data:', res);

        this.pdfFiles = Object.keys(res).map(key => ({
          name: key,
          url: res[key]
        }));

        if (this.pdfFiles.length > 0) {
          // 🔥 sanitize first file URL
          this.selectedFileUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(
              this.pdfFiles[0].url
            );
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


  // called when radio button changes
  onFileChange(url: string) {
    this.selectedFileUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }



}
