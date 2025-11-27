import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from '../../../core/services/core.services';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { COMMON_EXPORTS } from '../../../core/common-exports.constants';
import { Tooltip } from 'bootstrap';

@Component({
  selector: 'app-manager-manage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    COMMON_EXPORTS   // ✅ REQUIRED for formControlName, *ngIf
  ],
  templateUrl: './manager-manage.component.html',
  styleUrl: './manager-manage.component.scss'
})
export class ManagerManageComponent implements OnInit, AfterViewInit {

  Id: string | null = null;
  quantityForm: FormGroup;
  priceChangeForm: FormGroup;
  vendorChangeForm: FormGroup;
  statusForm: FormGroup;

  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);

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
    this.Id = this.route.snapshot.paramMap.get('id');
    console.log('Received ID:', this.Id);
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

  updateAndSave() {
    const element = document.getElementById('updateStatusOffcanvas');
    if (element) {
      const offcanvas = new bootstrap.Offcanvas(element);
      offcanvas.show();
    }
  }

  quantity() {
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
      comment: this.statusForm.value.comment
    };

    console.log('Status Submitted:', formData);
    // Call your service to save the status
    // this.yourService.updateStatus(formData).subscribe(...)
    const element = document.getElementById('updateStatusOffcanvas');
    if (element) {
      const canvas = bootstrap.Offcanvas.getInstance(element);
      if (canvas) canvas.hide();
    }
    this.coreService.displayToast({
      type: 'success',
      message: 'Status updated successfully.'
    });
  }
}

