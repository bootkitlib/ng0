import { CommonModule } from '@angular/common';
import { afterNextRender, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from '@bootkit/ng0/components/select';
import { DataResult, LocalDataSource, RemoteDataSource } from '@bootkit/ng0/data';
import { delay, of } from 'rxjs';

enum Sexuality {
    male = 'Male',
    female = 'Female',
    other = 'Other'
}

interface Person {
    id: number;
    name: string;
}

@Component({
    selector: 'app-examples-select',
    templateUrl: './select-example.component.html',
    standalone: true,
    imports: [
        CommonModule,
        SelectModule,
        FormsModule,
    ]
})
export class SelectExampleComponent {
    counter = signal(0);
    width = signal('200px');

    stringArray = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
    numberArray = Array.from({ length: 30 }, (_, i) => i + 1);
    objects1: Person[] = [
        { id: 1, name: 'Jane' },
        { id: 2, name: 'Doe' },
        { id: 3, name: 'Smith' },
        { id: 4, name: 'Johnson' },
        { id: 5, name: 'Brown' },
    ];

    localDatasource1 = new LocalDataSource(["Option 1", "Option 2", "Option 3"]);
    fakeRemoteDataSource1 = new RemoteDataSource(req => of(new DataResult([1, 2, 3, 4, 5])).pipe(delay(100)))
    Sexuality = Sexuality;

    value1?: string;
    value2?: string;
    value3?: number;
    value4 = 1;
    value5?: boolean;
    value6?: boolean;
    value7?: boolean;
    value8?: boolean;
    value9?: boolean;
    value10?: number;
    value11?: number;
    value12?: number;
    value13?: number;
    value14?: number;
    value15?: number;
    value16?: number;
    value17?: number;
    value18?: number;
    value19 = { id: 2 };
    value20?: number;

    // An object formatter function
    // Note: You should handle null|undefined objects too.
    objectFormatter1 = (item?: Person) => item?.name || '';

    onAddToDataSource1() {
        this.counter.update(x => ++x);
        this.localDatasource1.push(`Option ${this.counter()} was pushed.`)
    }

    onRemoveFromLocalDataSource1() {
        this.localDatasource1.remove(0);
    }

    onReplaceLocalDataSource1() {
        this.localDatasource1.replace(0, 'This item is replaced!')
    }
}
