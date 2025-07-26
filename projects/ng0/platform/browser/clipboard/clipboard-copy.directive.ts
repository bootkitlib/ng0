import { Directive, HostListener, input } from '@angular/core';
import { ClipboardService } from './clipboard.service';

@Directive({
  selector: '[ng0-clipboard-copy]',
  standalone: true
})
export class ClipboardCopyDirective {
  public value = input<string>(undefined, {alias: 'ng0-clipboard-copy'})

  constructor(private clipboardService: ClipboardService) {
  }

  

  @HostListener('click') private _onHostClick() {
    this.clipboardService.writeText(this.value()!);
  }
}
