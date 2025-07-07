import { Component, ChangeDetectionStrategy, Input, input, computed, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ng0-pagination',
  exportAs: 'ng0Pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
  standalone: true,
})
export class PaginationComponent {
  @Output() itemClick = new EventEmitter<number>();
  totalRecords = input.required<number>();
  pageSize = input<number>(10);

  /** 
   * Selected page. starts from 1.
   */
  selectedPage = input<number>(1);
  maxVisiblePages = input<number>(10);
  showNextButton = input<boolean>(true);
  showPreviousButton = input<boolean>(true);
  showFirstButton = input<boolean>(true);
  showLastButton = input<boolean>(true);
  protected _totalPagesCount: number;

  protected _visiblePages = computed(() => {
    let selectedPage = this.selectedPage();
    let totalRecords = this.totalRecords();
    let pageSize = this.pageSize();

    if (!Number.isInteger(totalRecords) || totalRecords < 0) {
      throw new Error('Total items must be a posotive integer.');
    }

    if (!Number.isInteger(pageSize) || pageSize <= 0) {
      throw new Error('Page size must be a posotive integer.');
    }

    this._totalPagesCount = Math.ceil(totalRecords / pageSize);

    if (selectedPage < 1 || selectedPage > this._totalPagesCount) {
      throw new Error(`Selected page must be between 1 and ${this._totalPagesCount}.`);
    }

    let indices = [];
    let firstVisiblePage = selectedPage;
    let lastVisiblePage = firstVisiblePage;
    let maxVisiblePages = this.maxVisiblePages();
    indices.push(firstVisiblePage);

    for (let i = 1; i <= maxVisiblePages; i++) {
      if (lastVisiblePage < this._totalPagesCount) {
        lastVisiblePage++;
        indices.push(lastVisiblePage);
      }

      if (indices.length >= maxVisiblePages) {
        break;
      }

      if (firstVisiblePage > 1) {
        firstVisiblePage--;
        indices.unshift(firstVisiblePage);
      }
    }

    return indices;
  });
}
