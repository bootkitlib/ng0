import { Component, computed, ContentChildren, EventEmitter, HostBinding, OnInit, Output, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';

/**
 * This component is used to contain multiple sidenav components and manage their layout.
 */
@Component({
  selector: 'ng0-sidenav-container',
  templateUrl: './sidenav-container.component.html',
  styleUrls: ['./sidenav-container.component.scss'],
  providers: [],
  standalone: true,
  imports: [
    CommonModule,
  ],
  host: {
    "[style.padding-inline-start]": "_contentPaddingStart()",
    "[style.padding-inline-end]": "_contentPaddingEnd()",
  }
})
export class SidenavContainerComponent implements OnInit {

  @Output() backdropClick = new EventEmitter();
  @ContentChildren(SidenavComponent) protected _sidenavs!: QueryList<SidenavComponent>;

  protected _contentPaddingStart = computed(() => {
    let widths = this._sidenavs.filter(x => x.open() && x.position() == 'start' && x.mode() == 'push').map(x => x.sidenavWidth());
    return widths.length == 0 ? '0' : `${Math.max(...widths)}px`;
  });

  protected _contentPaddingEnd = computed(() => {
    let widths = this._sidenavs.filter(x => x.open() && x.position() == 'end' && x.mode() == 'push').map(x => x.sidenavWidth());
    return widths.length == 0 ? '0' : `${Math.max(...widths)}px`;
  });

  constructor() {
  }

  ngOnInit(): void {

  }
}
