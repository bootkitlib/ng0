import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CollapseModule } from '@bootkit/ng0/components/collapse';

@Component({
    selector: 'app-collapse-example',
    templateUrl: './collapse-example.component.html',
    standalone: true,
    imports: [
        CollapseModule
    ]
})
export class CollapseExampleComponent  {
    c1 = false;
    c2 = false;
}
