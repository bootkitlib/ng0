import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalModule } from '@bootkit/ng0/components/modal';
 
@Component({
  selector: 'app-example-bootkit-modal',
  templateUrl: './modal-example.component.html',
  standalone: true,
  imports: [
      CommonModule,
      ModalModule
  ]
})
export class ModalExampleComponent {
  showModal1 = false;
  showModal2 = false;
  showModal3 = false;
  showModal4 = false;
  showModal5 = false;
  
}
