import { Component, ComponentRef, effect, ElementRef, EventEmitter, input, OnDestroy, OnInit, Output, Renderer2, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavMode, SidenavPosition } from './types';
import { BackdropComponent } from '@bootkit/ng0/components/backdrop';

@Component({
  selector: 'ng0-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  providers: [],
  standalone: true,
  imports: [
    CommonModule,
  ],
  host: {
    "[style.width]": "sidenavWidth() + 'px'",
    "[class.ng0-sidenav-start]": "position() == 'start'",
    "[class.ng0-sidenav-end]": "position() == 'end'",
    "[class.ng0-sidenav-open]": "open()",
    "[class.ng0-sidenav-fixed]": "fixedInViewport()",
  }
})
export class SidenavComponent implements OnInit, OnDestroy {
  public open = input(true);
  public mode = input<SidenavMode>('push');
  public hasBackdrop = input(true);
  public position = input<SidenavPosition>('start');
  public sidenavWidth = input.required<number>();
  public fixedInViewport = input(false);
  @Output() public backdropClick = new EventEmitter<MouseEvent>();
  private _backdropRef?: ComponentRef<any>;
  private _backdropClickHandlerUnlisten?: () => void;


  constructor(private _vcr: ViewContainerRef, private _elmentRef: ElementRef, private _renderer: Renderer2) {
    effect(() => {
      var hasBackdrop = this.hasBackdrop();
      var mode = this.mode();
      var open = this.open();

      if (mode == 'over' && hasBackdrop) {

        if (open) {
          this._backdropRef = this._vcr.createComponent(BackdropComponent, {});
          const backdropElm = this._backdropRef.location.nativeElement;
          this._backdropClickHandlerUnlisten = _renderer.listen(backdropElm, 'click', (e) => {
            this.backdropClick.emit(e);
          });

          // Move backdrop element before Host element
          const hostElm = this._elmentRef.nativeElement;
          const parentElm = hostElm.parentNode;
          this._renderer.insertBefore(parentElm, backdropElm, hostElm);
        } else {
          this._backdropRef?.destroy();
        }
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._backdropClickHandlerUnlisten?.();
  }
}
