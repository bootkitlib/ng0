import { Component, ChangeDetectionStrategy, Input, input, computed, Output } from '@angular/core';

@Component({
  selector: 'ng0-pagination',
  exportAs: 'ng0Pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
  standalone: true,
})
export class PaginationComponent {
  @Output() readonly pageChange = input<number>();
  totalRecords = input.required<number>();
  selectedPage = input<number>(0);
  pageSize = input<number>(10);
  pageSizeOptions = input<number[]>([10, 20, 50, 100]);
  showPageSizeSelector = input<boolean>(true);
  showFirstLastButtons = input<boolean>(true);
  protected _pages = computed(() => Array.from({ length: this.pagesCount() }, (_, i) => i + 1) );

  pagesCount = computed(() => {
    if (this.totalRecords() < 0) {
      throw new Error('Total records must be a non-negative number.');
    }

    if (this.pageSize() <= 0) {
      throw new Error('Page size must be greater than zero.');
    }

    return Math.ceil(this.totalRecords() / this.pageSize())
  });


}
