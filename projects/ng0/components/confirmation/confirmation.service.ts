import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { ConfirmationComponent } from './confirmation.component';
import { ConfirmationConfig, ConfirmationRef } from './types';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  constructor(private dialog: Dialog) { }

  open(config: ConfirmationConfig = {}): ConfirmationRef {
    var dlgRef = this.dialog.open(ConfirmationComponent, {
      disableClose: false,
    });

    var componentRef = dlgRef.componentInstance!;
    componentRef.confirmationRef = new ConfirmationRef(dlgRef, config);
    return componentRef.confirmationRef;
  }
}

