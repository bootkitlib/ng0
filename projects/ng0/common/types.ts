import { InjectionToken } from "@angular/core";

export type Placement = 'start' | 'end' | 'top' | 'bottom';
export type Alignment = 'start' | 'center' | 'end';
export const RTL = new InjectionToken<boolean>('RTL Direction');