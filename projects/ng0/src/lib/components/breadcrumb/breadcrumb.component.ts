import { Component, Input, Renderer2, ElementRef, ContentChild, Output, EventEmitter, OnInit } from '@angular/core';
import { BreadcrumbItemTemplateDirective } from './breadcrumb-item-template.directive';
import { BreadcrumbItem, BreadcrumbItemClickEvent } from './types';

@Component({
    selector: 'jss-breadcrumb',
    exportAs: 'jssBreadcrumb',
    templateUrl: './breadcrumb.component.html',
    styles: [':host {display: block;}']
})
export class BreadcrumbComponent implements OnInit {
    /**
     * breadcrumb items
     */
    @Input() items: BreadcrumbItem[];

    /**
     * triggers each time one of the breadcrumd items is clicked
     */
    @Output() itemClick = new EventEmitter<BreadcrumbItemClickEvent>();

    @ContentChild(BreadcrumbItemTemplateDirective) _itemTemplate: BreadcrumbItemTemplateDirective;

    constructor(private _el: ElementRef, private _renderer: Renderer2) {
    }

    ngOnInit(): void {
        this._renderer.setAttribute(this._el.nativeElement, 'role', 'navigation');
    }
}
