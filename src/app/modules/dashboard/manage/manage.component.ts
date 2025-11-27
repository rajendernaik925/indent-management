import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from '../../../core/services/core.services';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule   // ✅ REQUIRED for formControlName, *ngIf
  ],
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']   // ✅ corrected
})
export class ManageComponent implements OnInit {

  Id: string | null = null;
  isEdit: boolean = false;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);

  indentForm: FormGroup = this.fb.group({
    division: ['ASRA'],
    materialType1: ['5003'],
    materialType2: ['ZPCC'],
    quantity: ['250'],
    materialCode: ['14000003'],
    materialDesc: ['Lycortin S 100 mg inj (vial)'],
    estimatedPrice: ['15.50'],
    vendor: ['Medisource Pvt. Ltd.'],
    reason: [
      'Required for November distribution batch. Current stock below reorder level.'
    ]
  });

  ngOnInit() {
    this.Id = this.route.snapshot.paramMap.get('id');
    console.log('Received ID:', this.Id);

    
  }

  back() {
    window.history.back();
  }

  toggleEdit() {
    this.isEdit = true;

    // patch values again to ensure input fields show previous data
    this.indentForm.patchValue({
      division: this.indentForm.value.division,
      materialType1: this.indentForm.value.materialType1,
      materialType2: this.indentForm.value.materialType2,
      quantity: this.indentForm.value.quantity,
      materialCode: this.indentForm.value.materialCode,
      materialDesc: this.indentForm.value.materialDesc,
      estimatedPrice: this.indentForm.value.estimatedPrice,
      vendor: this.indentForm.value.vendor,
      reason: this.indentForm.value.reason
    });
  }


  saveChanges() {
    console.log('Updated Data →', this.indentForm.value);

    /** API CALL HERE */

    this.isEdit = false;

    this.coreService.displayToast({
      type: 'success',
      message: 'Changes Saved Successfully'
    });
  }
}
