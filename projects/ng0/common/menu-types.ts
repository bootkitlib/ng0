import { ClaimLike } from "./security-types";

/** Base class of all menu items  */
export interface MenuItem {
    type: 'group' | 'text' | 'divider';
    id?: any;
    disabled?: boolean;
    active?: boolean;
    show?: boolean;
    claim?: ClaimLike;
    parent?: MenuItem;
    text?: string;
    expanded?: boolean;
    icon?: string;
    children?: MenuItem[];
    routerLink?: string | string[];
}
