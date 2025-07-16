import { AfterContentInit, Component, DestroyRef, input, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalizationModule } from '@bootkit/ng0/localization';

@Component({
  selector: 'ng0-data-table-paging',
  templateUrl: './paging.component.html',
  // styleUrls: ['./paging.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // DateModule,
    LocalizationModule
  ]
})
export class DataTablePagingComponent implements OnInit, OnDestroy {
  // @Input() dataSource!: DataSource;
  @Input() autoLoad = true;
  rowNumber = input<boolean>(false);


  constructor(private _destroyRef: DestroyRef) {
  }

  ngOnInit(): void {
  }

  // ngAfterContentInit(): void {
  // }

  ngOnDestroy(): void {
  }
}
