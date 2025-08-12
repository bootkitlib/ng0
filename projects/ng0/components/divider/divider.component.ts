import {
  Component, ChangeDetectionStrategy,
  input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DividerPosition,
  DividerThickness
} from "@bootkit/ng0/components/divider/types";


@Component({
  selector: 'ng0-divider',
  exportAs: 'ng0Divider',
  template: `
    <h5 class="text-divider"
        [ngClass]="['text-' + position(), 'thickness-' + thickness()]"
        [style.--line-color]="color()"
        [style.--span-bg-color]="backgroundColor()"
    >
      <span>{{ text() }}</span>
    </h5>
  `,
  styles:`
    .text-divider {
      margin: 3em 0;
      line-height: 0;
      text-align: start;
      --line-color: #636674;
      --span-bg-color: var(--bs-body-bg);

      &.text-center {
        text-align: center;
      }

      &.text-end {
        text-align: end;
      }

      span {
        background-color: var(--span-bg-color);
        padding: 1rem;
      }

      &::before {
        content: ' ';
        display: block;
        border-top: 1px solid var(--line-color);
        border-bottom: 1px solid var(--line-color);
      }

      &.thickness-thin::before {
        border-width: 1px;
      }

      &.thickness-normal::before {
        border-width: 2px;
      }

      &.thickness-thick::before {
        border-width: 4px;
      }
    }


  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class DividerComponent {
  public readonly text = input<string>('')
  public readonly position = input<DividerPosition>('start')
  public readonly thickness = input<DividerThickness>('normal')
  public readonly color = input<string>('#636674')
  public readonly backgroundColor = input<string>('var(--bs-body-bg)')
}
