import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-examples',
  templateUrl: './bootkit-example.component.html',
  styleUrl: './bootkit-example.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class BootKitExampleComponent {

}
