import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../../../core/services/core.services';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { COMMON_EXPORTS } from '../../../core/common-exports.constants';
import { Tooltip } from 'bootstrap';
import { SharedModule } from '../../../shared/shared-modules';
import { HttpErrorResponse } from '@angular/common/http';
import { purchaseService } from '../purchase.service';
import { commonService } from '../../common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SettingsService } from '../../../core/services/settings.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchase-manage',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    COMMON_EXPORTS
  ],
  templateUrl: './purchase-manage.component.html',
  styleUrl: './purchase-manage.component.scss'
})
export class PurchaseManageComponent implements OnInit, AfterViewInit {

  Id: number | null = null;
  quantityForm: FormGroup;
  priceChangeForm: FormGroup;
  vendorChangeForm: FormGroup;
  statusForm: FormGroup;
  indentDetailsData: any;
  userDetail: any;
  userId: any;
  userAccess: any;
  pdfFiles: { name: string; url: string }[] = [];
  selectedFileUrl: any = null; // For iframe display
  showPDF = false;
  selectedFileIndex: number = 0;
  writeAccess: boolean = false;

  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);
  private purchseService: purchaseService = inject(purchaseService);
  private commonService: commonService = inject(commonService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private settingService: SettingsService = inject(SettingsService);
  private router: Router = inject(Router);

  constructor(private fb: FormBuilder) {

    // 🟢 FORM CREATED INSIDE CONSTRUCTOR
    this.quantityForm = this.fb.group({
      requested: [{ value: '', disabled: true }],
      newQty: ['', [Validators.required, Validators.min(1)]],
      comment: ['', Validators.required]
    });

    // price change form
    this.priceChangeForm = this.fb.group({
      newChange: ['', [Validators.required, Validators.min(1)]],
      comment: ['', [Validators.required, Validators.minLength(2)]]
    });

    // vendor form
    this.vendorChangeForm = this.fb.group({
      newVendor: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', [Validators.required, Validators.minLength(2)]]
    });

    // status form
    this.statusForm = this.fb.group({
      status: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }

  ngOnInit() {
    const encodedId = this.route.snapshot.paramMap.get('id');
    if (encodedId) {
      const decodedOnce = atob(encodedId);
      const decodedTwice = atob(decodedOnce);
      this.Id = Number(decodedTwice);
    }

    const employee = this.settingService.employeeInfo();
    this.userDetail = employee;
    this.userId = this.userDetail?.id
    const employeeAccess = this.settingService.moduleAccess();
    this.userAccess = employeeAccess;
    console.log('user access data : ', this.userAccess);
    const purchaseModule = this.userAccess.find(
      (m: { moduleId: number }) => m.moduleId === 4
    );
     this.writeAccess = purchaseModule ? purchaseModule.canWrite === true : false;
    console.log('Purchase module write access:', this.writeAccess);

    this.indentDetails();
  }

  indentDetails() {
    this.commonService.indentDetails(this.Id).subscribe({
      next: (res: any) => {
        const parsedRes = typeof res === 'string' ? JSON.parse(res) : res;
        this.indentDetailsData = parsedRes;
      },
      error: (err: HttpErrorResponse) => {
        console.log("error : ", err)
      }
    })
  }

  ngAfterViewInit() {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl: any) => {
      new Tooltip(tooltipTriggerEl);
    });
  }

  back() {
    window.history.back();
  }

  updateAndSave(id: any) {
    const element = document.getElementById('updateStatusOffcanvas');
    if (element) {
      const offcanvas = new bootstrap.Offcanvas(element);
      offcanvas.show();
    }
  }

  quantity(qnty: any) {
    console.log('selected loop data : ', qnty);
    this.coreService.displayToast({
      type: 'success',
      message: `selected quantity : ${qnty}`
    })
    const element = document.getElementById('offcanvasQuantity');
    if (element) {
      const offcanvas = new bootstrap.Offcanvas(element);
      offcanvas.show();
    }
  }

  estimatedPrice() {
    const element = document.getElementById('offcanvasPrice');
    if (element) {
      const offcanvas = new bootstrap.Offcanvas(element);
      offcanvas.show();
    }
  }

  vendorOffCanvas() {
    const element = document.getElementById('offcanvasVendor');
    if (element) {
      const offcanvas = new bootstrap.Offcanvas(element);
      offcanvas.show();
    }
  }

  updateQuantity() {

    if (this.quantityForm.invalid) {
      this.quantityForm.markAllAsTouched(); // show errors
      return;
    }

    const payload = {
      requested: this.quantityForm.get('requested')?.value,
      newQty: this.quantityForm.value.newQty,
      comment: this.quantityForm.value.comment
    };

    console.log('Updated Data:', payload);

    const element = document.getElementById('offcanvasQuantity');
    if (element) {
      const canvas = bootstrap.Offcanvas.getInstance(element);
      if (canvas) canvas.hide();
    }
    this.coreService.displayToast({
      type: 'success',
      message: 'Quantity updated successfully.'
    });

  }


  updatePriceChange(): void {
    if (this.priceChangeForm.invalid) {
      this.priceChangeForm.markAllAsTouched();
      return;
    }

    const updatedData = {
      newChange: this.priceChangeForm.value.newChange,
      comment: this.priceChangeForm.value.comment
    };

    console.log('Updated Change:', updatedData);
    // Call your service to save the change
    // this.yourService.updateChange(updatedData).subscribe(...)

    // Optionally reset the form
    // this.priceChangeForm.reset();
    const element = document.getElementById('offcanvasPrice');
    if (element) {
      const canvas = bootstrap.Offcanvas.getInstance(element);
      if (canvas) canvas.hide();
    }

    this.coreService.displayToast({
      type: 'success',
      message: 'Estimated Change updated successfully.'
    });
  }

  updateVendorChange(): void {
    if (this.vendorChangeForm.invalid) {
      this.vendorChangeForm.markAllAsTouched();
      return;
    }

    const updatedData = {
      newVendor: this.vendorChangeForm.value.newVendor,
      comment: this.vendorChangeForm.value.comment
    };

    console.log('Updated Vendor:', updatedData);
    // Call your service to save vendor change
    // this.yourService.updateVendor(updatedData).subscribe(...)

    // Optionally reset the form
    // this.vendorChangeForm.reset();
    const element = document.getElementById('offcanvasVendor');
    if (element) {
      const canvas = bootstrap.Offcanvas.getInstance(element);
      if (canvas) canvas.hide();
    }
    this.coreService.displayToast({
      type: 'success',
      message: 'Vendor updated successfully.'
    });
  }

  submitStatus(): void {
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    const formData = {
      status: this.statusForm.value.status,
      comments: this.statusForm.value.comment,
      indentId: this.Id,
    };

    console.log('Status Submitted:', formData);
    // Call your service to save the status
    // this.yourService.updateStatus(formData).subscribe(...)

    this.purchseService.updateIndentStatus(formData).subscribe({
      next: (res: any) => {
        this.coreService.displayToast({
          type: 'success',
          message: 'Status updated successfully.'
        });

        // Navigate back to manager list
        this.router.navigate(['/purchase']);

        this.indentDetails();
      },
      error: (err: any) => {
        this.coreService.displayToast({
          type: 'error',
          message: err
        });
      }
    });
    const element = document.getElementById('updateStatusOffcanvas');
    if (element) {
      const canvas = bootstrap.Offcanvas.getInstance(element);
      if (canvas) canvas.hide();
    }
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
        this.purchseService.removeMaterial(payload).subscribe({
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

