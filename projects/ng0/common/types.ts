import { InjectionToken } from "@angular/core";

export type Placement = 'start' | 'end' | 'top' | 'bottom';
export type Alignment = 'start' | 'center' | 'end';
export const RTL = new InjectionToken<boolean>('RTL Direction');


export type CompareFunction = (a: any, b: any) => number;

export function defaultCompareFunction(a: any, b: any): number {
    return a === b ? 0 : a < b ? -1 : 1;
}