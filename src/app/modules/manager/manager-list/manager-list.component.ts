import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { COMMON_EXPORTS } from '../../../core/common-exports.constants';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreService } from '../../../core/services/core.services';
import { SharedModule } from '../../../shared/shared-modules';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { managerService } from '../manager.service';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-manager-list',
  standalone: true,
  imports: [
    CommonModule,
    COMMON_EXPORTS,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  templateUrl: './manager-list.component.html',
  styleUrl: './manager-list.component.scss'
})
export class ManagerListComponent {

  userDetail: any;
  userId: any;
  userAccess: any;
  tableData: any[] = [];
  paginatedData: any[] = [];
  managerRequestList: any[] = [];
  tableKeys: string[] = [];
  currentPage = 1;
  pageSize = 7;
  totalRecords = 0;
  totalPages = 0;
  startIndex = 0;
  endIndex = 0;
  dateError: string | null = null;
  searchError: string | null = null;
  fromDate: string | null = null;
  toDate: string | null = null;
  selectedDivisionId: number | null = null;

  private coreService: CoreService = inject(CoreService);
  private router: Router = inject(Router);
  private managerService: managerService = inject(managerService);
  private settingService: SettingsService = inject(SettingsService);

  ngOnInit() {
    const employee = this.settingService.employeeInfo();
    this.userDetail = employee;
    this.userId = this.userDetail?.id
    const employeeAccess = this.settingService.moduleAccess();
    this.userAccess = employeeAccess;
    // this.loadIndents();
    this.callListAPI(
      this.currentPage,
      this.fromDate,
      this.toDate,
      this.selectedDivisionId
    );
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
    this.callListAPI(
      this.currentPage,
      this.fromDate,
      this.toDate,
      this.selectedDivisionId
    );
  }

  manageById(id: any) {
    this.router.navigate(['/manager/detail', id]);
    this.coreService.displayToast({
      type: 'success',
      message: `Managing Indent with ID: ${id}`
    });
  }

  // onDateChange(from: string, to: string) {
  //   this.fromDate = from || null;
  //   this.toDate = to || null;

  //   if (!from && to) {
  //     this.dateError = 'Please select From Date before To Date';
  //     this.coreService.displayToast({
  //       type: 'error',
  //       message: this.dateError
  //     });
  //     this.toDate = null;
  //     return;
  //   }

  //   this.dateError = null;

  //   this.resetAndLoad();
  // }
  onFromDateChange(from: string) {
    this.fromDate = from || null;

    // Reset To Date if it's invalid
    if (this.toDate && this.fromDate && this.toDate < this.fromDate) {
      this.toDate = null;
    }

    this.resetAndLoad();
  }

  /**
   * Called when To Date changes
   */
  onToDateChange(to: string) {
    if (!this.fromDate) {
      this.dateError = 'Please select From Date first';

      this.coreService.displayToast({
        type: 'error',
        message: this.dateError
      });

      this.toDate = null;
      return;
    }

    this.toDate = to || null;
    this.dateError = null;

    this.resetAndLoad();
  }

  onDivisionChange(event: Event) {
    const division = Number((event.target as HTMLSelectElement).value);
    this.selectedDivisionId = division;
    this.resetAndLoad();
    this.coreService.displayToast({
      type: 'success',
      message: `need to call list api with ${division}`
    })
  }

  private resetAndLoad() {
    this.currentPage = 1;
    this.callListAPI(
      this.currentPage,
      this.fromDate,
      this.toDate,
      this.selectedDivisionId
    );
  }

  callListAPI(
    pageNumber: number,
    fromDate: string | null,
    toDate: string | null,
    division: number | null
  ) {
    const payload = {
      userId: this.userDetail?.id ? this.userDetail?.id : null,
      pageNumber,
      division,
      fromDate,
      toDate
    };
    console.log("payload : ", payload);

    this.managerService.managerRequestList(payload).subscribe({
      next: (res: any) => {
        const parsedRes = typeof res === 'string' ? JSON.parse(res) : res;

        this.managerRequestList = parsedRes?.indents || [];
        this.totalRecords = parsedRes?.count ?? 0;
        this.pageSize = parsedRes?.size ?? 10;

        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

        this.startIndex = (this.currentPage - 1) * this.pageSize + 1;
        this.endIndex = Math.min(
          this.currentPage * this.pageSize,
          this.totalRecords
        );

        this.tableKeys = this.managerRequestList.length
          ? Object.keys(this.managerRequestList[0])
          : [];
      },

      error: (err: HttpErrorResponse) => {
        console.error('API Error:', err);
      }
    });
  }

  clearFilters() {
    if (
      (this.fromDate && this.fromDate !== '') ||
      (this.toDate && this.toDate !== '') ||
      (this.selectedDivisionId !== null)
    ) {
      window.location.reload();
    }
  }


}


