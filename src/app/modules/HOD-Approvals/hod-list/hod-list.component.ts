import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { COMMON_EXPORTS } from '../../../core/common-exports.constants';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreService } from '../../../core/services/core.services';
import { SharedModule } from '../../../shared/shared-modules';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../core/services/settings.service';


@Component({
  selector: 'app-hod-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    COMMON_EXPORTS
  ],
  templateUrl: './hod-list.component.html',
  styleUrl: './hod-list.component.scss'
})
export class HodListComponent {

 tableData: any[] = [];
  paginatedData: any[] = [];
  filteredData: any[] = [];
  currentPage = 1;
  pageSize = 7;
  totalRecords = 0;
  totalPages = 0;
  startIndex = 0;
  endIndex = 0;
  userDetail: any;
  userAccess: any;
  selectedStatus: string = 'all';
  colorTheme = 'my-custom-datepicker';


  private coreService: CoreService = inject(CoreService);
  private router: Router = inject(Router);
  private settingService: SettingsService = inject(SettingsService);
  private fb: FormBuilder = inject(FormBuilder);

  constructor() {}

  createMaterialForm(): FormGroup {
    return this.fb.group({
      division: ['', Validators.required],
      plant: ['', Validators.required],
      materialType: ['', Validators.required],
      materialText: ['', Validators.required],
      material: ['', Validators.required],
      qty: ['', Validators.required],
      EstimatedBudget: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      reason: ['', Validators.required],

      // For dropdown handling per row
      filteredMaterials: [[]],
      showList: [false]
    });
  }

  ngOnInit() {
    
    this.generateData();
    this.applyStatusFilter();
    this.applyPagination();

    const employee = this.settingService.employeeInfo();
    this.userDetail = employee;

    const employeeAccess = this.settingService.moduleAccess();
    this.userAccess = employeeAccess;

    console.log("User Detail: ", this.userDetail);
    console.log("User Access: ", this.userAccess);

  }

  // Generate 50 items (while loop)
  generateData() {
    let i = 1;
    while (i <= 50) {
      const statusList = [
        { status: 'Pending', statusText: 'Pending Manager Approval' },
        { status: 'Approved', statusText: 'Approved by HOD' },
        { status: 'Rejected', statusText: 'Rejected' },
        { status: 'PO Created', statusText: 'PO Created' }
      ];
      const currentStatus = statusList[i % 4];
      this.tableData.push({
        indentNo: `IND-2025-${1000 + i}`,
        division: i % 2 === 0 ? 'ASRA' : 'AURUM',
        code: 14000000 + i,
        description: `Sample Material Description ${i}`,
        plant: 5000 + (i % 10),
        type: i % 2 === 0 ? 'FERT' : 'ZPCC',
        qty: Math.floor(Math.random() * 400) + 50,
        // 🔥 added status + statusText
        status: currentStatus.status,
        statusText: currentStatus.statusText,
        reqDate: '03 Nov, 2025'
      });
      i++;
    }

    this.totalRecords = this.tableData.length;
  }




  // submitRequest() {
  //   // Use getRawValue() to include disabled controls
  //   const formValue = this.requestForm.getRawValue();

  //   if (this.requestForm.invalid) {
  //     this.requestForm.markAllAsTouched();
  //     this.coreService.displayToast({
  //       type: 'error',
  //       message: 'Please fill all required fields.'
  //     });
  //     return;
  //   }

  //   delete formValue.filteredMaterials;
  //   delete formValue.showList;
  //   console.log(formValue);

  //   this.coreService.displayToast({
  //     type: 'success',
  //     message: 'Request added successfully - IND-2025-1006'
  //   });

  //   this.visible = false;
  // }




  // resetMaterialsForm() {
  //   const materialArray = this.requestForm.get('materials') as FormArray;

  //   // Remove all rows
  //   while (materialArray.length > 0) {
  //     materialArray.removeAt(0);
  //   }

  //   // Add one fresh row
  //   const newRow = this.createMaterialForm();
  //   materialArray.push(newRow);

  //   // Reapply default division
  //   if (this.divisions.length === 1) {
  //     newRow.get('division')?.setValue(this.divisions[0].value);
  //     newRow.get('division')?.disable();
  //   } else {
  //     newRow.get('division')?.enable();
  //   }

  //   // Reapply default materialType
  //   if (this.materialType.length === 1) {
  //     newRow.get('materialType')?.setValue(this.materialType[0].value);
  //     newRow.get('materialType')?.disable();
  //   } else {
  //     newRow.get('materialType')?.enable();
  //   }
  // }




  statusFilter(status: string) {
    this.selectedStatus = status;
    this.applyStatusFilter();
    this.currentPage = 1;       // 🔥 reset to page 1 after filter
    this.applyPagination();
  }

  applyStatusFilter() {
    const statusMap: any = {
      all: null,
      approved: 'Approved',
      rejected: 'Rejected',
      pending: 'Pending'
    };

    if (statusMap[this.selectedStatus] === null) {
      this.filteredData = this.tableData;   // ALL records
    } else {
      this.filteredData = this.tableData.filter(
        (item) => item.status.toLowerCase() === statusMap[this.selectedStatus].toLowerCase()
      );
    }

    this.totalRecords = this.filteredData.length;
  }


  applyPagination() {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedData = this.filteredData.slice(start, end);

    this.startIndex = start + 1;
    this.endIndex = Math.min(end, this.totalRecords);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.applyPagination();
  }

  manageById(id: any) {
    this.router.navigate(['/hod-approvals/detail', id]);
    this.coreService.displayToast({
      type: 'success',
      message: `Managing Indent with ID: ${id}`
    });
  }




}


