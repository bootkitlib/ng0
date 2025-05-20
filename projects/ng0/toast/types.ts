export type ToastHorizontalPosition = 'start' | 'center' | 'end';
export type ToastVerticalPosition = 'top' | 'bottom';

export interface ToastConfig {
    message?: string;
    messageKey?: string;
    title?: string;
    icon?: string;
    // hint?: string;
    titleKey?: string;
    style?: string,
    duration?: number
    closeButton?: boolean,
    horizontalPosition?: ToastHorizontalPosition,
    verticalPosition?: ToastVerticalPosition
}

