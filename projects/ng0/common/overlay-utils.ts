import { Alignment, Placement } from "./types";
import { ConnectedPosition } from "@angular/cdk/overlay";

/**
 * Get the overlay position based on the provided placement and alignment.
 * 
 * @param placement - The placement of the overlay (e.g., 'bottom', 'top', 'start', 'end').
 * @param alignment - The alignment of the overlay (e.g., 'start', 'center', 'end').
 * @returns The connected position for the overlay.
 */
export function getOverlayConnectedPosition(placement: Placement, alignment: Alignment): ConnectedPosition {
      let pos = {} as ConnectedPosition;

      switch (placement) {
            case 'bottom':
                  pos.originY = 'bottom';
                  pos.overlayY = 'top';
                  pos.originX = alignment;
                  pos.overlayX = alignment;
                  break;
            case 'top':
                  pos.originY = 'top';
                  pos.overlayY = 'bottom';
                  pos.originX = alignment;
                  pos.overlayX = alignment;
                  break;
            case 'start':
                  pos.originX = 'start';
                  pos.overlayX = 'end';

                  if (alignment == 'start') {
                        pos.originY = 'top';
                        pos.overlayY = 'top';
                  } else if (alignment == 'center') {
                        pos.originY = 'center';
                        pos.overlayY = 'center';
                  } else {
                        pos.originY = 'bottom';
                        pos.overlayY = 'bottom';
                  }
                  break;
            case 'end':
                  pos.originX = 'end';
                  pos.overlayX = 'start';

                  if (alignment == 'start') {
                        pos.originY = 'top';
                        pos.overlayY = 'top';
                  } else if (alignment == 'center') {
                        pos.originY = 'center';
                        pos.overlayY = 'center';
                  } else {
                        pos.originY = 'bottom';
                        pos.overlayY = 'bottom';
                  }
                  break;
      }

      return pos;
}


export function flipPlacement(placement: Placement) {
    switch (placement) {
        case 'bottom':
            return 'top'
        case 'top':
            return 'bottom'
        case 'start':
            return 'end'
        case 'end':
            return 'start'
    }
}
