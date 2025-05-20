export interface BreadcrumbItem {
  text: string;
  active?: boolean;
  disabled?: boolean;
}

export interface BreadcrumbItemClickEvent {
  item: BreadcrumbItem;
  event: MouseEvent;
}
