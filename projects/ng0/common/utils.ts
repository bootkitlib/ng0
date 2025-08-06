import { Placement } from "./types";

/**
 * Flips the placement direction.
 * @param placement The placement direction to flip.
 * @returns The flipped placement direction.
 */
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
