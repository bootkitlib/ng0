import { Component, ChangeDetectionStrategy, input, computed, Output, EventEmitter } from '@angular/core';
import { TranslatePipe } from '@bootkit/ng0/localization';

@Component({
  selector: 'ng0-pagination',
  exportAs: 'ng0Pagination',
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
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
   * Selected page Index. starts from 1.
   */
  public selectedPage = input<number | undefined>(1);

  /**
   * Maximum number of visible pages.
   * Default is 10.
   */
  public maxVisiblePages = input<number>(10);

  /**
   * Show first button.
   * Default is true.
   */
  public showNextButton = input<boolean>(true);

  /**
   * Show previous button.
   * Default is true.
   */
  public showPreviousButton = input<boolean>(true);

  /**
   * Show first button.
   * Default is true.
   */
  public showFirstButton = input<boolean>(true);

  /**
   * Show last button.
   * Default is true.
   */
  public showLastButton = input<boolean>(true);

  /**
   * Total number of pages.
   * This is a computed property based on totalRecords and pageSize.
   * It is not an input property.
   */
  public get totalPagesCount() { return this._totalPagesCount; }

  /**
   * Emits the selected page index when a page is clicked.
   * The index starts from 0.
   */
  @Output() public itemClick = new EventEmitter<number>();

  protected _totalPagesCount!: number;

  protected _visiblePages = computed(() => {
    let selectedPage = this.selectedPage() || 0;
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
      throw new Error(`Selected page must be between 0 and ${this._totalPagesCount}.`);
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
