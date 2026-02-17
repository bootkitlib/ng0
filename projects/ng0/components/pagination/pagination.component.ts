import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input, computed, Output, EventEmitter, booleanAttribute, numberAttribute } from '@angular/core';
import { TranslatePipe } from '@bootkit/ng0/localization';

/**
 * Pagination component for displaying page numbers and navigation controls.
 * It calculates the total number of pages based on the total records and page size,
 * and determines which page numbers to display based on the selected page and maximum visible pages.
 */
@Component({
  selector: 'ng0-pagination',
  exportAs: 'ng0Pagination',
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe
  ]
})
export class PaginationComponent {
  /**
   * Total number of records.
   */
  public readonly totalRecords = input.required({ transform: numberAttribute });

  /**
   * Page size. Number of items in each page.
   * @default 10
   */
  public readonly pageSize = input(10, { transform: numberAttribute });

  /** 
   * Zero-based index of the selected page.
   * @default 0
   */
  public readonly selectedPage = input(0, { transform: numberAttribute });

  /**
   * Maximum number of visible pages.
   * @default 10
   */
  public readonly maxVisiblePages = input(10, { transform: numberAttribute });

  /**
   * Show first and last buttons.
   * @default true
   */
  public readonly showNextPreviousButtons = input(true, { transform: booleanAttribute });

  /**
   * Show first and last buttons.
   * @default true
   */
  public readonly showFirstLastButtons = input(true, { transform: booleanAttribute });

  /**
   * Total number of pages.
   * This is a computed property based on totalRecords and pageSize.
   * It is not an input property.
   */
  public get totalPagesCount() { return this._totalPagesCount; }

  /** 
   * Emits the selected page index when a page is clicked.
   * The index starts from 1.
   */
  @Output() public readonly itemClick = new EventEmitter<number>();

  protected _totalPagesCount!: number;

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

    if (selectedPage < 0 || selectedPage > this._totalPagesCount) {
      throw new Error(`Selected page index must be between 0 and ${this._totalPagesCount - 1}.`);
    }

    let indices = [];
    let firstVisiblePage = selectedPage;
    let lastVisiblePage = firstVisiblePage;
    let maxVisiblePages = this.maxVisiblePages();
    indices.push(firstVisiblePage);

    for (let i = 0; i < maxVisiblePages; i++) {
      if (lastVisiblePage < this._totalPagesCount - 1) {
        lastVisiblePage++;
        indices.push(lastVisiblePage);
      }

      if (indices.length >= maxVisiblePages) {
        break;
      }

      if (firstVisiblePage > 0) {
        firstVisiblePage--;
        indices.unshift(firstVisiblePage);
      }
    }

    return indices;
  });
}
