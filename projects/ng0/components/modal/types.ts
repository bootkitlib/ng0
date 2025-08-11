export type ModalCloseReason = 'backdrop' | 'escape' | 'programmatic';
export interface ModalCloseRequest {
  reason: ModalCloseReason;
  sourceEvent?: Event;
}
