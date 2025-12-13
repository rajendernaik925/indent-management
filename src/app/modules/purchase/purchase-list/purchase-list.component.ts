import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { COMMON_EXPORTS } from '../../../core/common-exports.constants';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreService } from '../../../core/services/core.services';
import { SharedModule } from '../../../shared/shared-modules';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [
    CommonModule,
    COMMON_EXPORTS, 
    SharedModule
  ],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss'
})
export class PurchaseListComponent implements OnInit {

tableData: any[] = [];
  paginatedData: any[] = [];
  currentPage = 1;
  pageSize = 7;
  totalRecords = 0;
  totalPages = 0;
  startIndex = 0;
  endIndex = 0;

  private coreService: CoreService = inject(CoreService);
  private router: Router = inject(Router);

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

  manageById(id: any) {
    this.router.navigate(['/purchase/detail', id]);
    this.coreService.displayToast({
      type: 'success',
      message: `Managing Indent with ID: ${id}`
    });
  }

}



