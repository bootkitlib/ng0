import { NgModule } from '@angular/core';
// import { CollapseDirective } from './collapse.directive';
import { CollapseComponent } from './collapse.component';

const items = [
    // CollapseDirective,
    CollapseComponent
];

@NgModule({
    imports: items,
    exports: items
})
export class CollapseModule {
}
