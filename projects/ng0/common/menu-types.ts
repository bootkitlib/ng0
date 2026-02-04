import { IsActiveMatchOptions } from "@angular/router";
import { ClaimLike, UserCondition } from "./security-types";

/** Menu item  */
export interface MenuItemBase {
    type?: string; // 'node', 'header', 'divider' or any other string;
    id?: any;
    show?: boolean;

    /**
     * @deprecated use 'user' instead
     */
    claim?: ClaimLike;
    cssClass?: string;
    data?: any;

    user?: UserCondition;
}

export interface NodeMenuItem extends MenuItemBase {
    type?: 'node';
    disabled?: boolean;
    text?: string;
    icon?: string;
    expanded?: boolean;
    children?: MenuItem[];
    parent?: MenuItem;
    routerLink?: string | string[];
    routerLinkActiveOptions?: { exact: boolean } | IsActiveMatchOptions;
    href?: string;
    target?: '_blank' | '_parent' | '_self' | '_top';
    tag?: string;
    tagCssClass?: string | string[];
}

export interface HeaderMenuItem extends MenuItemBase {
    type: 'header';
    disabled?: boolean;
    text?: string;
    icon?: string;
    tag?: string;
    tagCssClass?: string | string[];
}

export interface DividerMenuItem extends MenuItemBase {
    type: 'divider';
}

export type MenuItem = NodeMenuItem | HeaderMenuItem | DividerMenuItem;