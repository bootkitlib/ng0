import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lui-select',
  exportAs: 'luiSelect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select.component.html'
})
export class SelectComponent {
}
