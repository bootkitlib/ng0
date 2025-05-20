import { TemplateRef } from "@angular/core";

export type PopoverPlacement = 'top' | 'bottom' | 'start' | 'end';
export type PopoverTrigger = 'click' | 'dblclick' | 'hover' | 'focus';
export type PopoverContent = string | TemplateRef<any> | undefined | null;
