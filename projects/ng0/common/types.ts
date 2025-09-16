import { InjectionToken } from "@angular/core";

export const RTL = new InjectionToken<boolean>('RTL Direction');

/**
 * List item interface.
 */
export interface SelectOption {
    id: string,
    value: any,
    isFiltered: boolean,
    isActive: boolean,
    isSelected: boolean,
}
