import { transition, trigger, useAnimation } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// import { fadeInUpAnimation, fadeOutDownAnimation } from '@bootkit/ng0/animations';
import { DropdownModule } from '@bootkit/ng0/components/dropdown';

@Component({
    selector: 'app-dropdown-example',
    templateUrl: './dropdown-example.component.html',
    standalone: true,
    imports: [
        CommonModule,
        DropdownModule,
    ],
    // animations: [
    //     trigger('dropdownMenu', [
    //       transition(':enter', [useAnimation(fadeInUpAnimation, { params: {} })]),
    //       transition(':leave', [useAnimation(fadeOutDownAnimation, { params: {} })]),
    //     ])
    //   ]
})
export class DropdownExampleComponent {
    open1 = false;
    open2 = false;
    open3 = false;
    open4 = false;
    open5 = false;
}
