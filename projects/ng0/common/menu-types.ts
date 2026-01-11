import { ClaimLike } from "./security-types";

/** Menu item  */
export interface MenuItem {
    type?: 'item' | 'divider' | 'group';
    id?: any;
    disabled?: boolean;
    active?: boolean;
    show?: boolean;
    claim?: ClaimLike;
    text?: string;
    expanded?: boolean;
    icon?: string;
    children?: MenuItem[];
    routerLink?: string | string[];
    data?: any;
}
