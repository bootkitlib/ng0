import { ClaimLike } from "./security-types";

/** Menu item  */
export interface MenuItem {
    type?: 'item' | 'divider' | 'header';
    id?: any;
    disabled?: boolean;
    show?: boolean;
    active?: boolean;
    claim?: ClaimLike;
    text?: string;
    expanded?: boolean;
    icon?: string;
    children?: MenuItem[];
    routerLink?: string | string[];
    href?: string;
    target?: '_blank' | '_parent' | '_self' | '_top';
    data?: any;
}
