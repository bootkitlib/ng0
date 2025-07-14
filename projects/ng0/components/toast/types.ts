
import { TemplateRef } from "@angular/core";


export type ToastHorizontalPosition = 'start' | 'center' | 'end';

export type ToastVerticalPosition = 'top' | 'bottom';

/**
 * Configuration interface for toast notifications
 */
export interface ToastConfig {
    /** 
     * Main content of the toast. Can be a string, number, boolean or template reference
     */
    body?: string | number | boolean | TemplateRef<any>;
    
    /**
     * Header content of the toast. Can be a string, number, boolean or template reference
     */
    header?: string | number | boolean | TemplateRef<any>;
    
    /**
     * Additional hint text for the toast. Accepts string, number or boolean
     */
    hint?: string | number | boolean;
    
    /**
     * Icon to be displayed in the toast. Expects a string reference to the icon
     */
    icon?: string;
    
    /**
     * toast style: primary, secondary, danger, ...
     */
    style?: string;
    
    /**
     * Duration in milliseconds for how long the toast should be displayed
     */
    duration?: number;
    
    /**
     * Whether to show a close button on the toast
     */
    closeButton?: boolean;
    
    /**
     * Horizontal alignment of the toast. Can be 'start', 'center', or 'end'
     */
    horizontalPosition?: ToastHorizontalPosition;
    
    /**
     * Vertical alignment of the toast. Can be 'top' or 'bottom'
     */
    verticalPosition?: ToastVerticalPosition;
}

