import { booleanAttribute, Component, ComponentRef, effect, ElementRef, EventEmitter, input, OnDestroy, OnInit, Output, Renderer2, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavMode, SidenavPosition } from './types';
import { BackdropComponent } from '@bootkit/ng0/components/backdrop';

/**
 * This component is used to display a sidenav panel.
 * It can be positioned on the left or right side of the screen.
 * It can be opened or closed and can have a backdrop.
 */
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
    "[style.z-index]": "zIndex()",
    "[class.ng0-sidenav-start]": "position() == 'start'",
    "[class.ng0-sidenav-end]": "position() == 'end'",
    "[class.ng0-sidenav-open]": "open()",
    "[class.ng0-sidenav-show-backdrop]": "true",
    "[class.ng0-sidenav-fixed]": "fixedInViewport()",
  }
})
export class SidenavComponent implements OnInit, OnDestroy {
  public open = input(true, { transform: booleanAttribute });
  public mode = input<SidenavMode>('push');
  public hasBackdrop = input(true, { transform: booleanAttribute });
  public zIndex = input<number>();
  public position = input<SidenavPosition>('start');
  public sidenavWidth = input.required<number>();
  public fixedInViewport = input(false, { transform: booleanAttribute });
  @Output() public backdropClick = new EventEmitter<MouseEvent>();
  private _backdropRef?: ComponentRef<BackdropComponent>;
  private _backdropClickHandlerUnlisten?: () => void;


  constructor(private _vcr: ViewContainerRef, private _elmentRef: ElementRef, private _renderer: Renderer2) {
    effect(() => {
      var hasBackdrop = this.hasBackdrop();
      var mode = this.mode();
      var open = this.open();

      if (mode == 'over' && hasBackdrop && open) {
        this._createBackdrop();
      } else {
        this._destroyBackdrop();
      }
    });
  }

  ngOnInit(): void {
  }

  private _createBackdrop() {
    this._backdropRef = this._vcr.createComponent(BackdropComponent);
    const backdropElm = this._backdropRef.location.nativeElement;
    this._backdropRef.instance.fixed.set(this.fixedInViewport());
    if (this.zIndex() != undefined) {
      this._renderer.setStyle(backdropElm, 'z-index', this.zIndex());
    }
    this._backdropClickHandlerUnlisten = this._renderer.listen(backdropElm, 'click', (e) => {
      this.backdropClick.emit(e);
    });

    // Move backdrop element before Host element
    const hostElm = this._elmentRef.nativeElement;
    const parentElm = hostElm.parentNode;
    this._renderer.insertBefore(parentElm, backdropElm, hostElm);
  }

  private _destroyBackdrop() {
    this._backdropClickHandlerUnlisten?.();
    this._backdropRef?.destroy();

    this._backdropClickHandlerUnlisten = undefined;
    this._backdropRef = undefined;
  }

  ngOnDestroy(): void {
    this._destroyBackdrop();
  }
}
