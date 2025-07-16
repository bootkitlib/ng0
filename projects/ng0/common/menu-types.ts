import { ClaimLike } from "./security-types";

/** Base class of all menu items  */
export interface MenuItemBase<DataType = any> {
    type: 'group' | 'text' | 'divider';
    id?: any;
    disabled?: boolean;
    active?: boolean;
    show?: boolean;
    claim?: ClaimLike;
    parent?: MenuItem;
    data?: DataType;
}

/** Section Menu Item  */
export interface GroupMenuItem<DataType = any> extends MenuItemBase<DataType>{
    type: 'group';
    text: string;
    expanded?: boolean;
    icon?: string;
    children: Array<MenuItem<DataType>>;
}

/** Text Menu Item */
export interface TextMenuItem<DataType = any> extends MenuItemBase<DataType> {
    type: 'text';
    text: string;
    routerLink?: string[];
    icon?: string;
}

/** Divider Menu Item */
export interface DividerMenuItem<DataType = any> extends MenuItemBase<DataType> {
    type: 'divider';
}

export type MenuItem<DataType = any> = TextMenuItem<DataType> | DividerMenuItem<DataType> | GroupMenuItem<DataType>;
