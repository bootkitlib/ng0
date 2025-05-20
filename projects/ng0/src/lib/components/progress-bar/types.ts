import { BootstrapColor } from '../../common/types';
export type ProgressBarType = 'default' | 'striped' | 'striped-animated';
export interface ProgressBar {
    key?: any;
    minValue?: number;
    maxValue?: number;
    value?: number;
    color?: BootstrapColor;
    label?: string;
    type?: ProgressBarType;
}
