import { Injectable, signal, TemplateRef } from '@angular/core';

@Injectable()
export class VerticalMenuState {
  public readonly itemTemplate = signal<TemplateRef<any> | undefined>(undefined);

}

