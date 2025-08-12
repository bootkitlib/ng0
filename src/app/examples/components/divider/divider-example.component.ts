import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ModalModule } from '@bootkit/ng0/components/modal';
import {DividerComponent} from "@bootkit/ng0/components/divider";

@Component({
  selector: 'app-example-bootkit-modal',
  standalone: true,
  imports: [CommonModule, ModalModule, DividerComponent],
  template: `
    <ng0-divider text="اطلاعات مشتری" position="start"/>
    <ng0-divider text="توضیحات سفارش" position="center"/>
    <ng0-divider text="اطلاعات پرداخت" position="end"/>
    <ng0-divider
      text="اطلاعات مشتری"
      position="end"
      thickness="normal"
      color="#ff6600"

    />

  `,
})
export class DividerExampleComponent {

}
