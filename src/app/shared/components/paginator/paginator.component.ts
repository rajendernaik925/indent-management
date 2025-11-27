import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPageInfo } from '../../../core/modals/page';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})

export class PaginatorComponent {
  @Input() pageInfo: IPageInfo = {
    count: 0,
    page: 0,
    limit: 0,
    page_count: 0,
    next_page: false,
    prev_page: false,
  }
  @Output('page') page: EventEmitter<number> = new EventEmitter(false);

  nextPage() {
    const page = this.pageInfo.page && this.pageInfo.page + 1;
    this.page.emit(page);
  }

  prevPage() {
    const page = this.pageInfo.page && this.pageInfo.page - 1;
    this.page.emit(page);
  }
}
