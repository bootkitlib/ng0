import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

/**
 * This component is used to display a backdrop behind another component.
 */
@Component({
  selector: 'ng0-backdrop',
  template: '',
  styleUrl: 'backdrop.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('150ms ease', style({ opacity: 0 })),
      ]),
    ]),
  ],
  host: {
    '[@fade]': '', // Binds the animation trigger to the host
    '[class.fixed]': "fixed()"
  }
})
export class BackdropComponent {
  public readonly fixed = signal(false);
}