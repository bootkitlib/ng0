import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CollapseModule } from '@bootkit/ng0/collapse';

@Component({
    selector: 'app-collapse-example',
    templateUrl: './collapse-example.component.html',
    standalone: true,
    imports: [
        CollapseModule
    ]
})
export class CollapseExampleComponent implements OnInit, AfterViewInit {
    c1 = true;
    c2 = false;
    observer: ResizeObserver;

    constructor() {
    }

    ngOnInit(): void {
        // this.observer = new ResizeObserver((entries) => {
        //     for (const entry of entries) {
        //         console.log('entry:', entry);

        //         // if (entry.) {
        //         //   const contentBoxSize = entry.contentBoxSize[0];
        //         // }
        //     }
        // });
    }

    ngAfterViewInit(): void {
        // this.observer.observe(document.querySelector('#p1'));
        // this.observer.observe(document.querySelector('#p2'));
        // this.observer.observe(document.querySelector('#p3'));
    }
}
