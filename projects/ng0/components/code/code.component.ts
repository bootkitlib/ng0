import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CodeFormatters } from './code-formatters';

@Component({
  selector: 'ng0-code',
  exportAs: 'ng0Code',
  styleUrls: ['./code.component.scss'],
  templateUrl: './code.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeComponent {
  private _formatters = inject(CodeFormatters);
  private _domSanitizer = inject(DomSanitizer);

  /** Code formatter name */
  formatter = input.required<string>();

  /** Code */
  code = input.required<string>();

  protected _safeHtml = computed(() => {
    var frmt = this._formatters.find(this.formatter());

    if (frmt == null) {
      console.warn(`Code formatter named "${this.formatter()}" not found.`)
      return undefined;
    }

    return this._domSanitizer.bypassSecurityTrustHtml(frmt.format(this.code()));
  })
}
