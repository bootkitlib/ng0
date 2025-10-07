export interface ListItem {
    id: string,
    value: any,
    selected?: boolean,
    disabled?: boolean,
    filtered?: boolean,
}

export interface ListSelectionChangeEvent {
    value: any,
    index: number;
}
