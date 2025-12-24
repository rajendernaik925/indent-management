import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { COMMON_EXPORTS } from '../../../core/common-exports.constants';
import { CoreService } from '../../../core/services/core.services';
import { SharedModule } from '../../../shared/shared-modules';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../core/services/settings.service';
import { masterService } from '../../master.service';
import { purchaseService } from '../purchase.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [
    CommonModule,
    COMMON_EXPORTS,
    SharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss'
})
export class PurchaseListComponent implements OnInit {
  userDetail: any;
  userId: any;
  userAccess: any;
  tableData: any[] = [];
  paginatedData: any[] = [];
  managerRequestList: any[] = [];
  tableKeys: string[] = [];
  divisionList: any[] = [];
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
  selectedStatusId: number | null = null;
  writeAccess: boolean = false;

  private coreService: CoreService = inject(CoreService);
  private router: Router = inject(Router);
  private purchaseService: purchaseService = inject(purchaseService);
  private settingService: SettingsService = inject(SettingsService);
  private masterService: masterService = inject(masterService);

  ngOnInit() {
    const employee = this.settingService.employeeInfo();
    this.userDetail = employee;
    this.userId = this.userDetail?.id
    const employeeAccess = this.settingService.moduleAccess();
    this.userAccess = employeeAccess;

    const purchaseModule = this.userAccess.find(
      (m: { moduleId: number }) => m.moduleId === 4
    );
     this.writeAccess = purchaseModule ? purchaseModule.canWrite === true : false;
    console.log('Purchase module write access:', this.writeAccess);

    // this.loadIndents();
    this.callListAPI(
      this.currentPage,
      this.fromDate,
      this.toDate,
      this.selectedDivisionId,
      this.selectedStatusId
    );

    this.divisionMaster();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.callListAPI(
      this.currentPage,
      this.fromDate,
      this.toDate,
      this.selectedDivisionId,
      this.selectedStatusId
    );
  }

  manageById(id: any) {
    const encodedOnce = btoa(id.toString());
    const encodedTwice = btoa(encodedOnce);
    this.router.navigate(['/purchase/detail', encodedTwice]);
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
  }

  onStatusChange(event: Event) {
    const status = Number((event.target as HTMLSelectElement).value);
    this.selectedStatusId = status;
    this.resetAndLoad();
  }


  private resetAndLoad() {
    this.currentPage = 1;
    this.callListAPI(
      this.currentPage,
      this.fromDate,
      this.toDate,
      this.selectedDivisionId,
      this.selectedStatusId
    );
  }

  callListAPI(
    pageNumber: number,
    fromDate: string | null,
    toDate: string | null,
    divisionId: number | null,
    statusId: number | null,
  ) {
    const payload = {
      userId: this.userDetail?.id ? this.userDetail?.id : null,
      pageNumber,
      divisionId,
      fromDate,
      toDate,
      statusId
    };
    console.log("payload : ", payload);

    this.purchaseService.purchaseRequestList(payload).subscribe({
      next: (res: any) => {
        const parsedRes = typeof res === 'string' ? JSON.parse(res) : res;

        this.managerRequestList = parsedRes?.indents || [];
        this.totalRecords = parsedRes?.count ?? 0;
        this.pageSize = parsedRes?.size ?? 10;

        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

        this.startIndex = (this.currentPage - 1) * this.pageSize + 1;
        this.endIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);

        // Get table keys and filter out 'S.NO'
        this.tableKeys = this.managerRequestList.length
          ? Object.keys(this.managerRequestList[0]).filter(key => key !== 'S.NO')
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
      (this.selectedDivisionId !== null) ||
      (this.selectedStatusId !== null)
    ) {
      window.location.reload();
    }
  }

  divisionMaster() {
    this.masterService.divisionsMaster(this.userId, 'P').subscribe({
      next: (res: any) => {
        console.log("division masters : ", res);
        this.divisionList = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("error : ", err)
      }
    })
  }

}


