import { Placement } from "./types";
 
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

  export function numberRange(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, i) => i + start)
  }