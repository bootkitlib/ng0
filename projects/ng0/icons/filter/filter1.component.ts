import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @private
 */
@Component({
    selector: 'ng0-icon-filter1',
    templateUrl: 'filter1.svg',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule],
})
export class Filter1Icon {}
