export type PanelPosition = 'start' | 'end' | 'top' | 'bottom';
export type PanelPlacement = 'container' | 'viewport';
export type PanelStretch = 'start' | 'end' | 'both' | 'none';

/** Layout content position */
export interface LayoutContentPosition {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
