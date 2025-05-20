// import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Input, Directive } from '@angular/core';

@Directive({
  selector: '[jssNavbarCollapse]',
  exportAs: 'jsNavbarCollapse',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.show]': '!collapsed',
  },
  // animations: [
  //   trigger('collapsTrigger', [
  //     state('collapsed', style({
  //       height: '0',
  //     })),
  //     state('expanded', style({
  //       height: '*',
  //     })),
  //     transition('collapsed <=> expanded', [
  //       animate('.3s'),
  //     ]),
  //   ]),
  // ],
})
export class NavbarCollapseDirective {
  // private animating = false;
  @Input('jsNavbarCollapse') collapsed = true;

  constructor() {
  }

  // @HostBinding('@collapsTrigger') get trigger(): any {
  //   return {
  //     value: this.collapsed ? 'collapsed' : 'expanded',
  //     params: { collapsedHeight: this.animating ? '0' : '' }
  //   };
  // }

  // @HostListener('@collapsTrigger.start', ['$event']) start(event): void {
  //   this.animating = true;
  // }

  // @HostListener('@collapsTrigger.done', ['$event']) done(event): void {
  //   this.animating = false;
  // }
}
