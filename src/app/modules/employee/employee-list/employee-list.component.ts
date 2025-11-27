import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { COMMON_EXPORTS } from '../../../core/common-exports.constants';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreService } from '../../../core/services/core.services';
import { SharedModule } from '../../../shared/shared-modules';
import {  Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    COMMON_EXPORTS,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {

 tableData: any[] = [];
  paginatedData: any[] = [];
  currentPage = 1;
  pageSize = 6;
  totalRecords = 0;
  totalPages = 0;
  startIndex = 0;
  endIndex = 0;
  visible: boolean = false;

  //masters
  divisions = ['5003', '5004', '5005'];
  materialType1 = ['5003', '5004'];
  materialType2 = ['ZPCC', 'XMCC', 'TPCC'];
  materialCodes = ['14000003', '14000004'];

  private coreService: CoreService = inject(CoreService);
  private router: Router = inject(Router);

  requestForm: FormGroup = new FormGroup({
    division: new FormControl('', Validators.required),
    materialType1: new FormControl('', Validators.required),
    materialType2: new FormControl('', Validators.required),
    materialCode: new FormControl('', Validators.required),
    materialDesc: new FormControl('', Validators.required),
    qty: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    vendor: new FormControl('', Validators.required),
    reason: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.generateData();
    this.applyPagination();
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

  addNewRequest() {
    this.visible = true;
  }

  closeModal() {
    this.visible = false;
  }

  submitRequest() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      this.coreService.displayToast({
        type: 'error',
        message: 'Please fill all required fields.'
      })
      return;
    }
    console.log(this.requestForm.value);
    this.coreService.displayToast({
      type: 'success',
      message: 'Request added successfully - IND-2025-1006'
    })
    this.visible = false;
  }

  addMaterial() {
    this.coreService.displayToast({
      type: 'success',
      message: 'Material Should add!'
    })
  }

  applyPagination() {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedData = this.tableData.slice(start, end);

    this.startIndex = start + 1;
    this.endIndex = Math.min(end, this.totalRecords);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.applyPagination();
  }

  manageById(id:any) {
    this.router.navigate(['/employee/detail', id]);  
    this.coreService.displayToast({
      type: 'success',
      message: `Managing Indent with ID: ${id}`
    });
  }
}

