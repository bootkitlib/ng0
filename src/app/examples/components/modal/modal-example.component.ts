import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ModalModule } from '@bootkit/ng0/components/modal';
 
@Component({
  selector: 'app-example-bootkit-modal',
  templateUrl: './modal-example.component.html',
  standalone: true,
  imports: [
      CommonModule,
      ModalModule
  ]
})
export class ModalExampleComponent {
  // Basics & behavior
  showSimple       = signal(false);
  showHeaderFooter = signal(false);
  showStatic       = signal(false);
  showBackdrop   = signal(false);
  showEsc        = signal(false);

  // Size
  showSm      = signal(false);
  showDefault = signal(false);
  showLg      = signal(false);
  showXl      = signal(false);

  // Alignment & scrollable
  showCentered   = signal(false);
  showScrollable = signal(false);

  // Fullscreen
  showFsAlways = signal(false);
  showFsSm     = signal(false);
  showFsMd     = signal(false);
  showFsLg     = signal(false);
  showFsXl     = signal(false);
  showFsXxl    = signal(false);

  // dummy long content for scrollable example
  longList = Array.from({ length: 40 }, (_, i) => i + 1);
  
}
