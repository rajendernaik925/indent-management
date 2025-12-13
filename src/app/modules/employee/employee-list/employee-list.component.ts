import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { COMMON_EXPORTS } from '../../../core/common-exports.constants';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreService } from '../../../core/services/core.services';
import { SharedModule } from '../../../shared/shared-modules';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../core/services/settings.service';
interface Material {
  code: string;
  name: string;
  description: string;
}


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
  filteredData: any[] = [];
  currentPage = 1;
  pageSize = 7;
  totalRecords = 0;
  totalPages = 0;
  startIndex = 0;
  endIndex = 0;
  visible: boolean = false;
  userDetail: any;
  userAccess: any;
  selectedStatus: string = 'all';
  showList = false;
  materialType: any[] = [];
  divisions: any[] = [];
  filteredMaterials: Material[] = [];
  requestForm: FormGroup;
  maxDob: Date;
  colorTheme = 'my-custom-datepicker';


  //masters
  plant = [
    { value: '5003', name: 'Mumbai' },
    { value: '5080', name: 'Hyderabad' },
  ];

  materials: Material[] = [
    { code: '14000001', name: 'Steel Rod', description: 'High-quality steel rod' },
    { code: '14000002', name: 'Cement Bag', description: 'Premium grade cement' },
    { code: '14000003', name: 'Copper Wire', description: 'Pure copper electrical wire' },
    { code: '14000004', name: 'Aluminum Sheet', description: 'Lightweight aluminum sheet' },
    { code: '14000005', name: 'PVC Pipe', description: 'Durable PVC piping for plumbing' },
    { code: '14000006', name: 'Iron Nail', description: 'High-strength iron nails' },
    { code: '14000007', name: 'Wood Plank', description: 'Teak wood plank for construction' },
    { code: '14000008', name: 'Sand Bag', description: 'Fine quality river sand' },
    { code: '14000009', name: 'Bricks', description: 'Red clay bricks' },
    { code: '14000010', name: 'Glass Sheet', description: 'Tempered glass sheet' },
    { code: '14000011', name: 'Rubber Gasket', description: 'Flexible rubber gasket' },
    { code: '14000012', name: 'Steel Pipe', description: 'Strong steel pipes for plumbing' },
    { code: '14000013', name: 'Ceramic Tile', description: 'Glossy ceramic tile' },
    { code: '14000014', name: 'Paint Bucket', description: 'Exterior wall paint' },
    { code: '14000015', name: 'Adhesive Glue', description: 'Industrial strength adhesive' },
    { code: '14000016', name: 'Sandpaper', description: 'Fine grit sandpaper' },
    { code: '14000017', name: 'Concrete Mix', description: 'Pre-mixed concrete' },
    { code: '14000018', name: 'Iron Rod', description: 'Reinforced iron rods' },
    { code: '14000019', name: 'Steel Sheet', description: 'Galvanized steel sheet' },
    { code: '14000020', name: 'PVC Fitting', description: 'PVC connectors for plumbing' },
    { code: '14000021', name: 'Wood Screw', description: 'Stainless steel wood screws' },
    { code: '14000022', name: 'Glass Door', description: 'Sliding tempered glass door' },
    { code: '14000023', name: 'Aluminum Frame', description: 'Aluminum window frame' },
    { code: '14000024', name: 'Ceramic Basin', description: 'Wash basin with smooth finish' },
    { code: '14000025', name: 'Copper Pipe', description: 'Flexible copper pipes' },
    { code: '14000026', name: 'Plastic Sheet', description: 'Transparent plastic sheet' },
    { code: '14000027', name: 'Wire Rope', description: 'Steel wire rope for lifting' },
    { code: '14000028', name: 'Rubber Mat', description: 'Anti-slip rubber mat' },
    { code: '14000029', name: 'Concrete Block', description: 'Hollow concrete block' },
    { code: '14000030', name: 'Paint Roller', description: 'Wall paint roller' },
    { code: '14000031', name: 'Nylon Rope', description: 'Durable nylon rope' },
    { code: '14000032', name: 'Steel Bolt', description: 'High-tensile steel bolts' },
    { code: '14000033', name: 'Steel Nut', description: 'Hex steel nuts' },
    { code: '14000034', name: 'PVC Cap', description: 'PVC end cap' },
    { code: '14000035', name: 'Door Hinge', description: 'Stainless steel door hinge' },
    { code: '14000036', name: 'Ceiling Fan', description: 'Ceiling fan with motor' },
    { code: '14000037', name: 'Light Bulb', description: 'LED energy-saving bulb' },
    { code: '14000038', name: 'Switch Board', description: 'Modular switch board' },
    { code: '14000039', name: 'Copper Sheet', description: 'Industrial copper sheet' },
    { code: '14000040', name: 'Iron Sheet', description: 'Galvanized iron sheet' },
    { code: '14000041', name: 'PVC Window', description: 'PVC framed window' },
    { code: '14000042', name: 'Wood Door', description: 'Solid wood door' },
    { code: '14000043', name: 'Sandwich Panel', description: 'Insulated wall panel' },
    { code: '14000044', name: 'Steel Grating', description: 'Heavy-duty steel grating' },
    { code: '14000045', name: 'Concrete Slab', description: 'Precast concrete slab' },
    { code: '14000046', name: 'Ceramic Floor Tile', description: 'Matte finish floor tile' },
    { code: '14000047', name: 'PVC Sheet', description: 'PVC sheet for roofing' },
    { code: '14000048', name: 'Steel Wire', description: 'Mild steel wire coil' },
    { code: '14000049', name: 'Aluminum Rod', description: 'Lightweight aluminum rod' },
    { code: '14000050', name: 'Glass Panel', description: 'Tempered glass panel' },
    { code: '14000051', name: 'Rubber Hose', description: 'Flexible rubber hose' },
    { code: '14000052', name: 'Steel Angle', description: 'Steel angle for framing' },
    { code: '14000053', name: 'Plastic Pipe', description: 'PVC plastic pipe' },
    { code: '14000054', name: 'Door Lock', description: 'Mortise door lock' },
    { code: '14000055', name: 'Window Handle', description: 'Aluminum window handle' },
    { code: '14000056', name: 'Cable Tie', description: 'Plastic cable tie' },
    { code: '14000057', name: 'Water Tank', description: 'HDPE water tank' },
    { code: '14000058', name: 'Roof Tile', description: 'Concrete roof tile' },
    { code: '14000059', name: 'Floor Mat', description: 'Anti-slip floor mat' },
    { code: '14000060', name: 'Ceiling Panel', description: 'PVC ceiling panel' },
    { code: '14000061', name: 'Steel Beam', description: 'I-section steel beam' },
    { code: '14000062', name: 'Copper Tube', description: 'Copper plumbing tube' },
    { code: '14000063', name: 'Aluminum Sheet Coil', description: 'Aluminum sheet coil' },
    { code: '14000064', name: 'Ceramic Wall Tile', description: 'Glossy wall tile' },
    { code: '14000065', name: 'Paint Brush', description: 'Wall paint brush' },
    { code: '14000066', name: 'PVC Conduit', description: 'Electrical conduit pipe' },
    { code: '14000067', name: 'Wire Connector', description: 'Electrical wire connector' },
    { code: '14000068', name: 'Iron Pipe', description: 'Galvanized iron pipe' },
    { code: '14000069', name: 'Wood Beam', description: 'Structural wood beam' },
    { code: '14000070', name: 'Plastic Bucket', description: 'HDPE plastic bucket' },
    { code: '14000071', name: 'Steel Plate', description: 'Mild steel plate' },
    { code: '14000072', name: 'Rubber Seal', description: 'Flexible rubber seal' },
    { code: '14000073', name: 'Door Frame', description: 'Steel door frame' },
    { code: '14000074', name: 'Window Glass', description: 'Clear window glass' },
    { code: '14000075', name: 'Sand Bag', description: 'Coarse river sand' },
    { code: '14000076', name: 'Cement Mix', description: 'Ready mix cement' },
    { code: '14000077', name: 'Aluminum Profile', description: 'Aluminum extrusion profile' },
    { code: '14000078', name: 'Plastic Sheet Roll', description: 'PVC roll sheet' },
    { code: '14000079', name: 'Steel Rod Coil', description: 'Coiled steel rod' },
    { code: '14000080', name: 'Glass Bottle', description: 'Industrial glass bottle' },
    { code: '14000081', name: 'Rubber Mat Roll', description: 'Flexible rubber mat roll' },
    { code: '14000082', name: 'Concrete Mixer', description: 'Portable concrete mixer' },
    { code: '14000083', name: 'Paint Can', description: '5L exterior paint can' },
    { code: '14000084', name: 'PVC Elbow', description: 'PVC elbow joint' },
    { code: '14000085', name: 'Aluminum Clamp', description: 'Aluminum pipe clamp' },
    { code: '14000086', name: 'Steel Cable', description: 'High tensile steel cable' },
    { code: '14000087', name: 'Plastic Bucket Lid', description: 'Bucket lid for storage' },
    { code: '14000088', name: 'Door Stopper', description: 'Rubber door stopper' },
    { code: '14000089', name: 'Window Screen', description: 'Mesh window screen' },
    { code: '14000090', name: 'Ceramic Mug', description: 'Standard ceramic mug' },
    { code: '14000091', name: 'Steel Washer', description: 'Steel flat washer' },
    { code: '14000092', name: 'Aluminum Cap', description: 'Aluminum bottle cap' },
    { code: '14000093', name: 'PVC Connector', description: 'PVC pipe connector' },
    { code: '14000094', name: 'Copper Fitting', description: 'Plumbing copper fitting' },
    { code: '14000095', name: 'Wood Screw Pack', description: 'Pack of wood screws' },
    { code: '14000096', name: 'Steel Nut Pack', description: 'Pack of steel nuts' },
    { code: '14000097', name: 'Plastic Chair', description: 'Durable outdoor chair' },
    { code: '14000098', name: 'Iron Grill', description: 'Decorative iron grill' },
    { code: '14000099', name: 'Roof Sheet', description: 'Corrugated roof sheet' },
    { code: '14000100', name: 'Concrete Pipe', description: 'Precast concrete pipe' }
  ];

  private coreService: CoreService = inject(CoreService);
  private router: Router = inject(Router);
  private settingService: SettingsService = inject(SettingsService);
  private fb: FormBuilder = inject(FormBuilder);

  constructor() {
    this.maxDob = new Date();
    this.requestForm = this.fb.group({
      materials: this.fb.array([this.createMaterialForm()])
    });
  }

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

  get materialsArray(): FormArray {
    return this.requestForm.get('materials') as FormArray;
  }

  ngOnInit() {
    this.materialType = [
      { value: 'zmsi', name: 'Promotional Material' },
    ];

    this.divisions = [
      { value: '5003', name: 'Hyderabad' },
      // { value: '5004', name: 'Mumbai' },
      // { value: '5005', name: 'Bangalore' }
    ];
    
    this.generateData();
    this.applyStatusFilter();
    this.applyPagination();

    const employee = this.settingService.employeeInfo();
    this.userDetail = employee;

    const employeeAccess = this.settingService.moduleAccess();
    this.userAccess = employeeAccess;

    console.log("User Detail: ", this.userDetail);
    console.log("User Access: ", this.userAccess);

    // Auto-select single-option dropdowns
    this.setSingleOption(this.materialType, 'materialType', 0);
    this.setSingleOption(this.divisions, 'division', 0);

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
    this.resetMaterialsForm();
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

  submitRequest() {
    const formValue = this.requestForm.getRawValue();

    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      this.coreService.displayToast({
        type: 'error',
        message: 'Please fill all required fields.'
      });
      return;
    }

    // Remove fields from each material row
    const cleanedMaterials = formValue.materials.map((row: any) => {
      return {
        division: row.division,
        plant: row.plant,
        materialType: row.materialType,
        // materialText: row.materialText,
        material: row.material,
        qty: row.qty,
        EstimatedBudget: row.EstimatedBudget,
        deliveryDate: row.deliveryDate,
        reason: row.reason
      };
    });

    console.log(cleanedMaterials);

    this.coreService.displayToast({
      type: 'success',
      message: 'Request added successfully - IND-2025-1006'
    });

    this.visible = false;
    this.resetMaterialsForm();
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
    if (this.divisions.length === 1) {
      newRow.get('division')?.setValue(this.divisions[0].value);
      newRow.get('division')?.disable();
    } else {
      newRow.get('division')?.enable();
    }

    // Reapply default materialType
    if (this.materialType.length === 1) {
      newRow.get('materialType')?.setValue(this.materialType[0].value);
      newRow.get('materialType')?.disable();
    } else {
      newRow.get('materialType')?.enable();
    }
  }






  addMaterial() {
    const last = this.materialsArray.at(this.materialsArray.length - 1);
    if (last.invalid) {
      last.markAllAsTouched();
      return;
    }

    this.materialsArray.push(this.createMaterialForm());
    const index = this.materialsArray.length - 1;

    // Apply single-option logic
    this.setSingleOption(this.materialType, 'materialType', index);
    this.setSingleOption(this.divisions, 'division', index);
  }


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
    this.router.navigate(['/employee/detail', id]);
    this.coreService.displayToast({
      type: 'success',
      message: `Managing Indent with ID: ${id}`
    });
  }

  onSearch(index: number) {
    const group = this.materialsArray.at(index) as FormGroup;

    const text = group.get('materialText')?.value?.trim().toLowerCase();

    if (!text || text.length < 3) {
      group.patchValue({
        filteredMaterials: [],
        showList: false,
        material: ''
      });
      return;
    }

    const filtered = this.materials.filter(m =>
      m.code.toLowerCase().includes(text) ||
      m.name.toLowerCase().includes(text) ||
      (m.description && m.description.toLowerCase().includes(text))
    );

    group.patchValue({
      filteredMaterials: filtered,
      showList: true
    });

    if (filtered.length === 0) {
      group.get('material')?.setValue('');
    }
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




}

