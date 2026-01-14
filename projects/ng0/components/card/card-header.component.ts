import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ng0-card-header',
    exportAs: 'ng0CardHeader',
    templateUrl: 'card-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule]
})
export class CardHeaderComponent {
}
