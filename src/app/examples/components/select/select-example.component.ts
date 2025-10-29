import { CommonModule } from '@angular/common';
import { afterNextRender, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule, SelectItemEvent } from '@bootkit/ng0/components/select';
import { DataResult, LocalDataSource, RemoteDataSource } from '@bootkit/ng0/data';
import { delay, of } from 'rxjs';
import { Sexuality } from 'src/app/common/enums';
import { RouterLink } from "@angular/router";
import { format } from 'path';


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
        RouterLink
    ]
})
export class SelectExampleComponent {
    Sexuality = Sexuality;
    width = signal('200px');
    stringArray = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
    numberArray = Array.from({ length: 3000 }, (_, i) => i + 1);
    personList1: Person[] = [
        { id: 1, name: 'Jane' },
        { id: 2, name: 'Doe' },
        { id: 3, name: 'Smith' },
        { id: 4, name: 'Johnson' },
        { id: 5, name: 'Brown' },
    ];

    localDatasource1 = new LocalDataSource(["Option 1", "Option 2", "Option 3"]);
    fakeRemoteDataSource1 = new RemoteDataSource(req => of(new DataResult(this.personList1)).pipe(delay(3000)))

    examples = {
        stringArray: {
            value1: 'Three'
        },
        numberArray: {
            value1: 5
        },
        booleanArray: {
            value1: undefined
        },
        enum: {
            value1: Sexuality.female
        },
        objectArray: {
            value1: undefined
        },
        format: {
            value1: undefined,
            value2: undefined,
            value3: undefined,
            value4: undefined,
            value5: undefined,
        },
        compare: {
            value1: 2,
            value2: { id: 3 },
            personComparerFunc: (sourceItem?: Person, value?: Person) => {
                // Expect null values for sourceItem or value, so compare values with null-safe operator (?.)
                return sourceItem?.id === value?.id;
            }
        },
        write: {
            value1: undefined,
            value2: undefined,
            value3: undefined,
            personIdWriterFunc: (item: Person) => item.id
        },
        remoteDatasource: {
            value1: 3
        },
        manipulation: {
            value1: undefined,
            add: () => {
                let newItem = `[${Date()}]: A new Item!`;
                this.stringArray = [...this.stringArray, newItem];
            }
        },
        filterExample: {
            value1: undefined,
            value2: undefined,
            value3: undefined,
            filterFunc: (item: Person, filter: string) => item.name.toLocaleLowerCase().includes(filter.toLowerCase())
        },
        customTemplate: {
            value1: undefined,
        },
        disabledState: {
            value1: undefined,
            isDisabled: false
        },
        events: {
            value1: [],
            onValueChange(e: SelectItemEvent) {
                console.log(e)
            }
        }
    }

    multiSelectExample = {
        value1: undefined,
        value2: undefined,
        value3: undefined,
    };

    value16?: number;
    value17?: number;
    value18?: number;

    // An object formatter function
    // Note: You should handle null|undefined objects too.
    personFormatterFunc = (item?: Person) => item?.name || '';




}
