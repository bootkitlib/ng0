import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

@Component({
  selector: 'ng0-backdrop',
  template: '',
  styleUrl: 'backdrop.component.css',
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
  }
})
export class BackdropComponent {}