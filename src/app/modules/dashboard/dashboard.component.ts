import { Component, inject, OnInit } from '@angular/core';
import { COMMON_EXPORTS } from '../../core/common-exports.constants';
import { CoreService } from '../../core/services/core.services';

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

  private coreService: CoreService = inject(CoreService);

  ngOnInit() { }

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

}
