import { Component, inject, OnInit } from '@angular/core';
import { COMMON_EXPORTS } from '../../core/common-exports.constants';
import { CoreService } from '../../core/services/core.services';
import { StorageService } from '../../core/services/storage.service';
import { SettingsService } from '../../core/services/settings.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import * as echarts from 'echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    COMMON_EXPORTS,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEchartsModule
  ],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts } // ✅ FIX
    }
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  indentVisible: boolean = false;

   chartOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Indent Status',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 22,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 10, name: 'Purchased' },
          { value: 6, name: 'In Progress' },
          { value: 4, name: 'Approved' },
          { value: 2, name: 'Rejected' }
        ]
      }
    ]
  };

  

  private coreService: CoreService = inject(CoreService);
  private settingService: SettingsService = inject(SettingsService);

  indentForm: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required]),
    brand: new FormControl('', [Validators.required]),
    cost: new FormControl('', [Validators.required]),
    quantity: new FormControl(null, [Validators.required]),
    materialCode: new FormControl('', [Validators.required]),
    plant: new FormControl('', [Validators.required]),
    remarks: new FormControl('', [Validators.required]),
    materialType: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    const employee = this.settingService.employeeInfo();
    const employeeAccess = this.settingService.moduleAccess();
    console.log("Employee Info in Dashboard: ", employee);
    console.log("Employee Info Access in Dashboard: ", employeeAccess);
  }
  routeEmployeeModule() {
    this.coreService.displayToast({
      type: 'success',
      message: 'Welcome to Indent Management Rajender'
    })
  }

  welcomeToast() {
    this.coreService.displayToast({
      type: 'success',
      message: 'Welcome to Indent Management Rajender'
    })
  }

  newIndent() {
    this.indentVisible = true;
  }

  closeModal() {
    this.indentVisible = false;
  }

  submitIndent() {
    if (this.indentForm.invalid) return;

    console.log("Form Data:", this.indentForm.value);

    // Continue API call...
  }

  reports = [
  {
    indentId: '#IND-1001',
    total: 15,
    purchased: 8,
    inProgress: 4,
    approved: 2,
    rejected: 1,
    status: 'In Progress'
  },
  {
    indentId: '#IND-1002',
    total: 10,
    purchased: 10,
    inProgress: 0,
    approved: 0,
    rejected: 0,
    status: 'Completed'
  }
];

searchIndent: string = '';
selectedStatus: string = '';

get filteredReports() {
  return this.reports.filter(r => {
    const matchesIndent =
      r.indentId.toLowerCase().includes(this.searchIndent.toLowerCase());

    const matchesStatus =
      !this.selectedStatus || r.status === this.selectedStatus;

    return matchesIndent && matchesStatus;
  });
}


}
