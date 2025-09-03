import { ClaimLike } from "./security-types";

/** Menu item  */
export interface MenuItem {
    type?: string;
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
