import { Component, ContentChild, input } from '@angular/core';
import { VerticalMenuArrowDirective } from './item-arrow.directive';

@Component({
  selector: 'ng0-vertical-menu, ng0-vmenu',
  templateUrl: './vertical-menu.component.html',
  standalone: true,
  styles: `:host {display: block}`,
  imports: [],
})
export class VerticalMenuComponent {
  /**
   * Whether to expand/collapse items when clicking on them
   */
  public readonly expandItemsByClick = input(true);

  public readonly collapseTimings = input<string | number>('0.15s');

  @ContentChild(VerticalMenuArrowDirective, { descendants: false })
  public readonly arrowDirective?: VerticalMenuArrowDirective;
}

