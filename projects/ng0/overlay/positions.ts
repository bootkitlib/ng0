import { getConnectedPosition, getConnectedPositions } from "./utils";

// Positions
export const START_START_POS = getConnectedPosition('start', 'start');
export const START_CENTER_POS = getConnectedPosition('start', 'center');
export const START_END_POS = getConnectedPosition('start', 'end');

export const END_START_POS = getConnectedPosition('end', 'start');
export const END_CENTER_POS = getConnectedPosition('end', 'center');
export const END_END_POS = getConnectedPosition('end', 'end');

export const TOP_START_POS = getConnectedPosition('top', 'start');
export const TOP_END_POS = getConnectedPosition('top', 'end');
export const TOP_CENTER_POS = getConnectedPosition('top', 'center');

export const BOTTOM_START_POS = getConnectedPosition('bottom', 'start');
export const BOTTOM_CENTER_POS = getConnectedPosition('bottom', 'center');
export const BOTTOM_END_POS = getConnectedPosition('bottom', 'end');


// Flipped positions
export const START_START_FLIPPED_POS = getConnectedPositions('start', 'start');
export const START_CENTER_FLIPPED_POS = getConnectedPositions('start', 'center');
export const START_END_FLIPPED_POS = getConnectedPositions('start', 'end');

export const END_START_FLIPPED_POS = getConnectedPositions('end', 'start');
export const END_CENTER_FLIPPED_POS = getConnectedPositions('end', 'center');
export const END_END_FLIPPED_POS = getConnectedPositions('end', 'end');

export const TOP_START_FLIPPED_POS = getConnectedPositions('top', 'start');
export const TOP_END_FLIPPED_POS = getConnectedPositions('top', 'end');
export const TOP_CENTER_FLIPPED_POS = getConnectedPositions('top', 'center');

export const BOTTOM_START_FLIPPED_POS = getConnectedPositions('bottom', 'start');
export const BOTTOM_CENTER_FLIPPED_POS = getConnectedPositions('bottom', 'center');
export const BOTTOM_END_FLIPPED_POS = getConnectedPositions('bottom', 'end');