import { Directive, ElementRef, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[ng0Focus]',
  exportAs: 'ng0Focus',
  standalone: true
})
export class FocusDirective implements OnInit, OnChanges {
  @Input() focusOnLoad = true;
  @Input() focusWhen?: boolean;
  private focused = false;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    if (this.focusOnLoad) {
      setTimeout(() => {
        this.elementRef.nativeElement.focus();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['focusWhen']) {
      if (this.focusWhen) {
        setTimeout(() => {
          this.elementRef.nativeElement.focus();
        });
      }
    }
  }
}
