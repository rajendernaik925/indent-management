import { Component, inject, OnInit } from '@angular/core';
import { COMMON_EXPORTS } from '../../core/common-exports.constants';
import { SettingsService } from '../../core/services/settings.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import * as echarts from 'echarts';
import { ModuleAccess } from '../../core/modals/access';

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


  chartOption = {
    tooltip: {
      trigger: 'item'
    },
    // legend: {
    //   top: '50%',
    //   left: 'center'
    // },
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

  modules: ModuleAccess[] = [
    { moduleId: 1, moduleName: 'Dashboard', displayInUi: false, canWrite: false },
    { moduleId: 2, moduleName: 'Indent Requests', displayInUi: false, canWrite: false },
    { moduleId: 3, moduleName: 'Manager Approvals', displayInUi: false, canWrite: false },
    { moduleId: 4, moduleName: 'Purchase Approvals', displayInUi: false, canWrite: false },
    { moduleId: 5, moduleName: 'HOD Approvals', displayInUi: false, canWrite: false }
  ];

  private settingService: SettingsService = inject(SettingsService);

  ngOnInit() {
    const employee = this.settingService.employeeInfo();
    const employeeAccess: ModuleAccess[] = this.settingService.moduleAccess();

    this.modules.forEach(module => {
      const found = employeeAccess?.find(
        access => access.moduleId === module.moduleId
      );

      module.displayInUi = found ? found.displayInUi : false;
      module.canWrite = found ? found.canWrite : false;
    });

    // console.log("Employee Info Access in Dashboard: ", employeeAccess);
    // console.log("Employee Info in Dashboard: ", employee);
  }

}
