import { Component, inject, OnInit } from '@angular/core';
import { COMMON_EXPORTS } from '../../core/common-exports.constants';
import { CoreService } from '../../core/services/core.services';
import { StorageService } from '../../core/services/storage.service';
import { SettingsService } from '../../core/services/settings.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    COMMON_EXPORTS,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  indentVisible: boolean = false;

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

}
