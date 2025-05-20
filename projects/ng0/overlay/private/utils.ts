import { ConnectedPosition } from "@angular/cdk/overlay";
import { Alignment, Placement } from "@bootkit/ng0/common";

/**
 * Get the overlay position based on the provided placement and alignment.
 * 
 * @param overlayPlacement - The placement of the overlay (e.g., 'bottom', 'top', 'start', 'end').
 * @param overlayAlignment - The alignment of the overlay (e.g., 'start', 'center', 'end').
 * @returns The connected position for the overlay.
 */
export function getOverlayPosition(overlayPlacement: Placement, overlayAlignment: Alignment): ConnectedPosition {
      let p = {} as ConnectedPosition;
      switch (overlayPlacement) {
            case 'bottom':
                  p.originY = 'bottom';
                  p.overlayY = 'top';
                  p.originX = overlayAlignment;
                  p.overlayX = overlayAlignment;
                  break;
            case 'top':
                  p.originY = 'top';
                  p.overlayY = 'bottom';
                  p.originX = overlayAlignment;
                  p.overlayX = overlayAlignment;
                  break;
            case 'start':
                  p.originX = 'start';
                  p.overlayX = 'end';

                  if (overlayAlignment == 'start') {
                        p.originY = 'top';
                        p.overlayY = 'top';
                  } else if (overlayAlignment == 'center') {
                        p.originY = 'center';
                        p.overlayY = 'center';
                  } else {
                        p.originY = 'bottom';
                        p.overlayY = 'bottom';
                  }
                  break;
            case 'end':
                  p.originX = 'end';
                  p.overlayX = 'start';

                  if (overlayAlignment == 'start') {
                        p.originY = 'top';
                        p.overlayY = 'top';
                  } else if (overlayAlignment == 'center') {
                        p.originY = 'center';
                        p.overlayY = 'center';
                  } else {
                        p.originY = 'bottom';
                        p.overlayY = 'bottom';
                  }
                  break;
      }

      return p;
}
