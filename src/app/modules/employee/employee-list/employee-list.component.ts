import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { COMMON_EXPORTS } from '../../../core/common-exports.constants';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreService } from '../../../core/services/core.services';
import { SharedModule } from '../../../shared/shared-modules';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../core/services/settings.service';
import { moduleService } from '../../module.service';
import { employeeService } from '../employee.service';
import { debounceTime, Subject } from 'rxjs';
// interface Material {
//   code: string;
//   name: string;
//   description: string;
// }


@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    COMMON_EXPORTS,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {

  tableData: any[] = [];
  paginatedData: any[] = [];
  indentRequestList: any[] = [];
  tableKeys: string[] = [];
  pageSize = 0;
  filteredData: any[] = [];
  currentPage = 1;
  totalRecords = 0;
  totalPages = 0;
  startIndex = 0;
  endIndex = 0;
  visible: boolean = false;
  userDetail: any;
  userId: any;
  userAccess: any;
  plantId!: number;
  materialTypeId!: number;
  selectedStatus: string = 'all';
  showList = false;
  materialType: any[] = [];
  divisions: any[] = [];
  plants: any[] = [];
  materials: any[] = [];
  filteredMaterials: any[] = [];
  requestForm: FormGroup;
  maxDob: Date;
  colorTheme = 'my-custom-datepicker';

  private searchSubject = new Subject<string>();
  dateError: string | null = null;
  searchError: string | null = null;
  fromDate: string | null = null;
  toDate: string | null = null;
  searchInputValue: string = '';


  private coreService: CoreService = inject(CoreService);
  private router: Router = inject(Router);
  private settingService: SettingsService = inject(SettingsService);
  private fb: FormBuilder = inject(FormBuilder);
  private moduleService: moduleService = inject(moduleService);
  private employeeService: employeeService = inject(employeeService);

  constructor(private http: HttpClient) {
    this.maxDob = new Date();
    this.requestForm = this.fb.group({
      division: ['', Validators.required],
      estimatedBudget: ['', Validators.required],
      plannedBudget: ['', Validators.required],
      file: [null],
      materials: this.fb.array([this.createMaterialForm()])
    });


    this.searchSubject
      .pipe(debounceTime(300))
      .subscribe(searchValue => {

        this.searchInputValue = searchValue;

        if (!searchValue) {
          this.searchError = null;
          this.resetAndLoad();    // load without search
          return;
        }

        // if (searchValue.length < 3) {
        //   this.searchError = 'Please enter at least 3 characters';
        //   return;
        // }

        this.searchError = null;
        this.resetAndLoad();      // ✅ RESET PAGE
      });

  }

  createMaterialForm(): FormGroup {
    return this.fb.group({
      plant: ['', Validators.required],
      materialType: ['', Validators.required],
      material: ['', Validators.required],
      qty: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      reason: ['', Validators.required],

      // For dropdown handling per row
      filteredMaterials: [[]],
      showList: [false]
    });
  }

  get materialsArray(): FormArray {
    return this.requestForm.get('materials') as FormArray;
  }

  ngOnInit() {
    const employee = this.settingService.employeeInfo();
    this.userDetail = employee;
    this.userId = this.userDetail?.id
    const employeeAccess = this.settingService.moduleAccess();
    this.userAccess = employeeAccess;

    // Auto-select single-option dropdowns
    // this.setSingleOption(this.materialType, 'materialType', 0);
    // this.setSingleOption(this.divisions, 'division', 0);

    this.mastersApis();
    // this.callListAPI(this.currentPage, null, null, null);
    // this.loadIndents();
    this.callListAPI(
      this.currentPage,
      this.searchInputValue,
      this.fromDate,
      this.toDate
    );
  }


  // loadIndents(page: number = 1) {
  //   const payload = {
  //     userId: this.userId,
  //     pageNumber: page,
  //     search: this.searchInputValue || null,
  //     fromDate: this.fromDate,
  //     toDate: this.toDate
  //   };

  //   this.employeeService.indentRequestList(payload).subscribe({
  //     next: (res: any) => {
  //       const parsedRes = typeof res === 'string' ? JSON.parse(res) : res;
  //       this.indentRequestList = parsedRes?.indents || [];
  //       this.pageSize = parsedRes?.size ?? 10;
  //       this.totalRecords = parsedRes?.count ?? 0;
  //       this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  //       this.currentPage = page;

  //       // Start & end index for display
  //       this.startIndex = (this.currentPage - 1) * this.pageSize + 1;
  //       this.endIndex = Math.min(this.startIndex + this.indentRequestList.length - 1, this.totalRecords);

  //       // Table headers
  //       // this.tableKeys = this.indentRequestList.length > 0 ? Object.keys(this.indentRequestList[0]) : [];
  //       this.tableKeys =
  //         this.indentRequestList.length > 0
  //           ? Object.keys(this.indentRequestList[0]).filter(key => key !== 'S.NO')
  //           : [];

  //     },
  //     error: (err) => {
  //       console.error('API Error:', err);
  //     }
  //   });
  // }

  // Handle pagination button clicks
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.callListAPI(
      this.currentPage,
      this.searchInputValue,
      this.fromDate,
      this.toDate
    );
  }


  callListAPI(
    pageNumber: number,
    search: string | null,
    fromDate: string | null,
    toDate: string | null
  ) {
    const payload = {
      userId: this.userDetail?.id ? this.userDetail?.id : null,
      pageNumber,
      search: search,
      fromDate,
      toDate
    };

    console.log('Payload to send:', payload);

    this.employeeService.indentRequestList(payload).subscribe({
      next: (res: any) => {
        const parsedRes = typeof res === 'string' ? JSON.parse(res) : res;

        this.indentRequestList = parsedRes?.indents || [];
        this.totalRecords = parsedRes?.count ?? 0;
        this.pageSize = parsedRes?.size ?? 10;

        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

        this.startIndex = (this.currentPage - 1) * this.pageSize + 1;
        this.endIndex = Math.min(
          this.currentPage * this.pageSize,
          this.totalRecords
        );

        this.tableKeys = this.indentRequestList.length
          ? Object.keys(this.indentRequestList[0])
          : [];
      },

      error: (err: HttpErrorResponse) => {
        console.error('API Error:', err);
      }
    });
  }



  addNewRequest() {
    this.visible = true;
  }

  closeModal() {
    this.visible = false;
    this.resetMaterialsForm();
  }

  submitRequest() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      this.coreService.displayToast({
        type: 'error',
        message: 'Please fill all required fields.'
      });
      return;
    }

    const formValue = this.requestForm.getRawValue();

    // Prepare JSON data
    const indentData = {
      division: Number(formValue.division),
      raisedBy: Number(this.userDetail?.id),
      plannedBudget: Number(formValue.plannedBudget),
      estimatedBudget: Number(formValue.estimatedBudget),
      materialRequests: (formValue.materials || []).map((row: any) => ({
        plant: Number(row.plant),
        materialType: Number(row.materialType),
        material: Number(row.material),
        quantity: Number(row.qty),
        deliveryDate: row.deliveryDate,
        comments: row.reason || ''
      }))
    };

    // Create FormData
    const formData = new FormData();

    // Append JSON as string (backend expects @RequestParam)
    formData.append('indentData', JSON.stringify(indentData));

    // Append files if any
    if (this.selectedFiles?.length) {
      this.selectedFiles.forEach((file: File) => {
        formData.append('files', file, file.name);
      });
    }

    // Optional: debug FormData
    const fd: any = formData;
    for (const [key, value] of fd.entries()) {
      console.log(key, value);
    }

    // Send multipart/form-data
    this.employeeService.raiseIndentRequest(formData).subscribe({
      next: (res: any) => {
        this.coreService.displayToast({
          type: 'success',
          message: res
        });
        this.visible = false;
        this.resetMaterialsForm();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.coreService.displayToast({
          type: 'error',
          message: err.message || 'Failed to submit request'
        });
      }
    });
  }

  removeMaterial(index: number) {
    if (this.materialsArray.length === 1) {
      return; // ❌ prevent removing the last row
    }
    this.materialsArray.removeAt(index); // ✅ remove the row
  }

  resetMaterialsForm() {
    const materialArray = this.requestForm.get('materials') as FormArray;

    // Remove all rows
    while (materialArray.length > 0) {
      materialArray.removeAt(0);
    }

    // Add one fresh row
    const newRow = this.createMaterialForm();
    materialArray.push(newRow);

    // Reapply default division
    // if (this.divisions.length === 1) {
    //   newRow.get('division')?.setValue(this.divisions[0].value);
    //   newRow.get('division')?.disable();
    // } else {
    //   newRow.get('division')?.enable();
    // }

    // Reapply default materialType
    // if (this.materialType.length === 1) {
    //   newRow.get('materialType')?.setValue(this.materialType[0].value);
    //   newRow.get('materialType')?.disable();
    // } else {
    //   newRow.get('materialType')?.enable();
    // }
  }

  addMaterial() {
    const lastIndex = this.materialsArray.length - 1;
    const lastGroup = this.materialsArray.at(lastIndex) as FormGroup;

    if (lastGroup.invalid) {
      lastGroup.markAllAsTouched();
      return;
    }

    this.materialsArray.push(this.createMaterialForm());
    const index = this.materialsArray.length - 1;

    // Apply single-option logic ONLY for child controls
    // this.setSingleOption(this.materialType, 'materialType', index);
  }






  applyPagination() {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedData = this.filteredData.slice(start, end);

    this.startIndex = start + 1;
    this.endIndex = Math.min(end, this.totalRecords);
  }


  // manageById(id: any) {
  //   this.router.navigate(['/employee/detail', id]);
  //   this.coreService.displayToast({
  //     type: 'success',
  //     message: `Managing Indent with ID: ${id}`
  //   });
  // }

  manageById(id: any) {
    const encodedOnce = btoa(id.toString());
    const encodedTwice = btoa(encodedOnce);
    this.router.navigate(['/employee/detail', encodedTwice]);
  }

  selectMaterial(index: number, m: any) {
    const group = this.materialsArray.at(index) as FormGroup;

    group.patchValue({
      material: m.code,
      materialText: `${m.code} - ${m.name}`,
      showList: false
    });
  }

  onBlurMaterial(index: number) {
    const group = this.materialsArray.at(index) as FormGroup;
    const text = group.get('materialText')?.value?.trim().toLowerCase();

    if (!text) {
      group.patchValue({ material: '' });
      return;
    }

    const matched = this.materials.find(m =>
      (`${m.code} - ${m.name}`.toLowerCase() === text) ||
      (m.code.toLowerCase() === text)
    );

    if (!matched) {
      group.patchValue({
        materialText: '',
        material: ''
      });
    }
  }


  setSingleOption(selectArray: any[], controlName: string, index: number) {
    const group = this.materialsArray.at(index) as FormGroup;
    const control = group.get(controlName);

    if (!control) return;

    if (selectArray.length === 1) {
      control.setValue(selectArray[0].value);
      control.disable();
    } else {
      control.enable();
    }

    control.updateValueAndValidity();
  }

  onPlantChange(event: Event) {
    this.plantId = Number((event.target as HTMLSelectElement).value);
    this.checkAndCallApi();
  }

  onMaterialChange(event: Event) {
    this.materialTypeId = Number((event.target as HTMLSelectElement).value);
    this.checkAndCallApi();
  }

  checkAndCallApi() {
    if (this.plantId && this.materialTypeId) {
      this.callAnotherApi(this.plantId, this.materialTypeId);
    }
  }

  callAnotherApi(plantId: number, materialTypeId: number) {
    const payload = {
      plant: plantId,
      materialType: materialTypeId,
      search: ''
    };

    this.moduleService.materialsMaster(payload).subscribe({
      next: (res) => {
        console.log('matrails Response:', res);
        this.materials = res;
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });
  }


  mastersApis() {
    this.divisionMaster();
    this.plantsMaster();
    this.materialTypesMaster();
  }

  divisionMaster(): void {
    if (!this.userDetail.id) {
      return;
    }

    this.moduleService.divisionsMaster(this.userDetail.id, 'I').subscribe({
      next: (res: any) => {
        this.divisions = res;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error:', err);
      }
    });
  }

  plantsMaster() {
    this.moduleService.plantsMaster().subscribe({
      next: (res: any) => {
        this.plants = res;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error:', err);
      }
    });
  }

  materialTypesMaster() {
    this.moduleService.materialTypesMaster().subscribe({
      next: (res: any) => {
        this.materialType = res;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error:', err);
      }
    });
  }


  selectedFiles: File[] = [];

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedFiles = Array.from(input.files);

    // Validate PDF only (extra safety)
    const invalidFile = this.selectedFiles.find(
      file => file.type !== 'application/pdf'
    );

    if (invalidFile) {
      this.coreService.displayToast({
        type: 'error',
        message: 'Only PDF files are allowed'
      });
      this.selectedFiles = [];
      input.value = '';
      return;
    }

    // Mark form as valid
    this.requestForm.patchValue({ file: this.selectedFiles });
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  onDateChange(from: string, to: string) {
    this.fromDate = from || null;
    this.toDate = to || null;

    if (!from && to) {
      this.dateError = 'Please select From Date before To Date';
      this.coreService.displayToast({
        type: 'error',
        message: this.dateError
      });
      this.toDate = null;
      return;
    }

    this.dateError = null;

    this.resetAndLoad(); 

    // if (!this.searchError && (this.searchInputValue?.length >= 3 || !this.searchInputValue)) {
    //   this.resetAndLoad();   // ✅ RESET PAGE
    // }
  }

  private resetAndLoad() {
    this.currentPage = 1;
    this.callListAPI(
      this.currentPage,
      this.searchInputValue,
      this.fromDate,
      this.toDate
    );
  }

  clearFilters() {
    if ((this.fromDate && this.fromDate !== '') ||
      (this.toDate && this.toDate !== '') ||
      (this.searchInputValue && this.searchInputValue.trim() !== '')) {
      window.location.reload();
    }
  }


}

