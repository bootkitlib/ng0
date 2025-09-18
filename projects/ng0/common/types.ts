import { InjectionToken } from "@angular/core";

export const RTL = new InjectionToken<boolean>('RTL Direction');

/**
 * List item interface.
 */
export interface SelectOption {
    id: string,
    value: any,
    show?: boolean,
}
