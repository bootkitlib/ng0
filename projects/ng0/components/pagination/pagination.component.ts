import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input, computed, Output, EventEmitter } from '@angular/core';
import { TranslatePipe } from '@bootkit/ng0/localization';

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
  public totalRecords = input.required<number>();

  /**
   * Page size. Number of items in each page.
   */
  public pageSize = input<number>(10);

  /** 
   * Zero-based index of the selected page.
   */
  public selectedPage = input<number>(0);

  /**
   * Maximum number of visible pages.
   * Default is 10.
   */
  public maxVisiblePages = input<number>(10);

  /**
   * Show first and last buttons.
   * Default is true.
   */
  public showNextPreviousButtons = input<boolean | undefined>(true);

  /**
   * Show first and last buttons.
   * Default is true.
   */
  public showFirstLastButtons = input<boolean | undefined>(true);

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
  @Output() public itemClick = new EventEmitter<number>();

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

  public _onPageChange(pageIndex: number) {
    debugger
    console.log('click')
    this.itemClick.emit(pageIndex);
  }

}
