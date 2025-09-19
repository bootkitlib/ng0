import { CommonModule } from '@angular/common';
import { afterNextRender, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getEnumValues } from '@bootkit/ng0/common';
import { ListModule } from '@bootkit/ng0/components/list';
import { DataResult, LocalDataSource, RemoteDataSource } from '@bootkit/ng0/data';
import { delay, of } from 'rxjs';

enum Sexuality {
    male = 'Male',
    female = 'Female',
    other = 'Other'
}


@Component({
    selector: 'app-examples-list',
    templateUrl: './list-example.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ListModule,
        FormsModule,
    ]
})
export class ListExampleComponent {
    counter = signal(0);

    stringArray = ['One', 'Two', 'Three'];
    numberArray = Array.from({ length: 3 }, (_, i) => i + 1);
    objects1 = [
        { id: 1, name: 'Option 1' },
        { id: 2, name: 'Option 2' },
        { id: 3, name: 'Option 3' },
    ];
    localDatasource1 = new LocalDataSource(["Option 1", "Option 2", "Option 3"]);
    fakeRemoteDataSource1 = new RemoteDataSource(req => of(new DataResult([1, 2, 3, 4, 5])).pipe(delay(100)))

    stringValue1?: string;
    stringValue2?: string;
    stringValues1?: string[];
    stringValues2?: string[];
    numberValue1?: number;
    numberValue2 = 1;
    booleanValue1?: boolean;
    booleanValue2?: boolean;
    booleanValue3?: boolean;
    booleanValue4?: boolean;
    selectedObjectId1?: number;
    selectedObjectId2?: number;
    selectedObjectId3?: number;
    selectedObjectId4?: number;
    selectedObjectId5?: number;

    Sexuality = getEnumValues(Sexuality);

    enum1?: boolean;

    width = signal('200px');

    onAddToDataSource1() {
        this.counter.update(x => ++x);
        this.localDatasource1.push(`An Option was pushed (${this.counter()}).`)
    }

    onRemoveFromLocalDataSource1() {
        this.localDatasource1.remove(0);
    }

    onReplaceLocalDataSource1() {
        this.localDatasource1.replace(0, 'This item is replaced!')
    }
}
