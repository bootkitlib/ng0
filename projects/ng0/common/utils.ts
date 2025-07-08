import { Placement } from "./types";

export function numberRange(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, i) => i + start)
}

export function fillArray(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
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
