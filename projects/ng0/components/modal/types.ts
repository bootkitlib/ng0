export interface ModalCloseRequest {
    reason: 'backdrop' | 'escape';
    event: Event;
}; 
