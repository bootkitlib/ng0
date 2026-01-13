import { ClaimLike } from "./security-types";

/** Menu item  */
export interface MenuItem {
    type?: 'item' | 'divider' | 'group';
    id?: any;
    disabled?: boolean;
    show?: boolean;
    claim?: ClaimLike;
    text?: string;
    expanded?: boolean;
    icon?: string;
    children?: MenuItem[];
    routerLink?: string | string[];
    target?: '_blank' | '_parent' | '_self' | '_top';
    data?: any;
}
