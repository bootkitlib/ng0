import { Component } from '@angular/core';
import { NavModule } from '@bootkit/ng0/components/nav';

@Component({
  selector: 'tabs-example',
  templateUrl: './tabs-example.component.html',
  standalone: true,
  imports: [
    NavModule
  ]
})
export class TabsExampleComponent {
  selectedIndex = 1;
}
