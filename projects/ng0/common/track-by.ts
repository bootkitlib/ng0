import { TrackByFunction } from "@angular/core";

/**
 * An item tracker that can be either a TrackByFunction or a string property name.
 */
export type TrackByLike = TrackByFunction<any> | string;

/**
 * A trackBy function that tracks items by their index.
 */
export const trackByIndex: TrackByFunction<any> = (index: number, item: any) => index;

/**
 * A trackBy function that tracks items by the item itself.
 */
export const trackByItem: TrackByFunction<any> = (index: number, item: any) => item;

/**
 * Converts a TrackByLike to a TrackByFunction.
 * @param v The item tracker to convert.
 * @returns A TrackByFunction.
 */
export function TrackByAttribute(v: TrackByLike): TrackByFunction<any> {
    if (typeof v === 'function')
        return v;
    else if (typeof v === 'string') {
        if(v.startsWith('@item')) {
            return trackByItem;
        } else if(v.startsWith('@index')) {
            return trackByIndex;
        } else {
            return (index: number, item: any) => item ? item[v] : undefined;
        }
    }

    throw Error('invalid TrackBy value');
}
