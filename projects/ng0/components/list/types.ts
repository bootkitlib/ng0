export interface ListItem {
    id: string,
    value: any,
    selected?: boolean,
    disabled?: boolean,
    filtered?: boolean,
}

export interface ListItemSelectionChangeEvent {
    index: number;
    item: any,
    selected: boolean,
}
