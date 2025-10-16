import { CommonModule } from '@angular/common';
import { Component, model, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPredicate } from '@bootkit/ng0/common';
import { ListModule, ListSelectionChangeEvent } from '@bootkit/ng0/components/list';
import { DataResult, DataSource, LocalDataSource, RemoteDataSource } from '@bootkit/ng0/data';
import { delay, of } from 'rxjs';

enum Sexuality {
    male = 'Male',
    female = 'Female',
    other = 'Other'
}

interface ListItem {
    id: number;
    name: string;
    description: string;
}

@Component({
    selector: 'app-examples-list',
    templateUrl: './list-example.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        ListModule,
        FormsModule,
    ]
})
export class ListExampleComponent {

    Sexuality = Sexuality;
    width = signal('200px');
    counter = signal(0);

    stringArray = ['One', 'Two', 'Three'];
    numberArray = Array.from({ length: 3 }, (_, i) => i + 1);
    objectsSource1: ListItem[] = [
        { id: 1, name: 'Option 1', description: 'Option 1 description' },
        { id: 2, name: 'Option 2', description: 'Option 2 description' },
        { id: 3, name: 'Option 3', description: 'Option 3 description' },
    ];
    localDatasource1 = new LocalDataSource(Array.from({ length: 3 }, (_, i) => i + 1));
    fakeRemoteDataSource1 = new RemoteDataSource(req => of(new DataResult([1, 2, 3, 4, 5])).pipe(delay(100)))

    value0?: string; value1?: string; value2?: string; value3?: string[] = []; value4?: string[] = ['One'];
    value5?: boolean; value6?: boolean; value7?: boolean; value8?: boolean; value9?: number;
    value10?: number; value11 = { id: 2 }; value12 = { id: 3 }; value13? = { id: 2 }; value14? = { id: 3 };
    value15?: number[] = []; value16?: number; value17?: number; value18?: number; value19?: number;
    value20?: number; value21?: string; value22?: string; value23 = signal('Two'); value24?: string;
    value25 = 1; value26 = 'Three'; value27?: string; value28?: string; value29?: string;
    value30 = 2; value31: any; value32: any; value33: any;

    list17FilterValue = model('');
    list15SelectedIndices: ReadonlyArray<number> = [];

    compareFunction1 = (sourceItem: any, value: any) => sourceItem?.id === value?.id;
    compareFunction2 = (sourceItem: any, value: any) => sourceItem?.id === value;
    customValueWriter1 = (obj: any) => obj?.id;
    personFormatter1 = (item?: any) => item ? `${item.id}) - ${item.name}` : '';
    list17FilterFunction: FilterPredicate = (item) => {
        if (!this.list17FilterValue()) return true;
        return item.value.toLowerCase().indexOf(this.list17FilterValue().toLowerCase()) >= 0;
    }

    idGenerator1 = (item: any, index?: number) => item;

    onList15SelectionChange(e: ListSelectionChangeEvent) {
        this.list15SelectedIndices = e.selectedIndices;
    }

    onPushToDataSource1() {
        this.counter.update(x => ++x);
        this.localDatasource1.push(`Pushed: (${this.counter()}).`)
    }

    // onRemoveFirstItemOfLocalDataSource1() {
    //     this.localDatasource1.remove(0);
    // }

    // onRemoveSelectedItemsOfLocalDataSource1() {
    //     if(this.list15SelectedIndices.length) {
    //         this.localDatasource1.remove(...this.list15SelectedIndices);
    //     }
    // }

    // onReplaceLocalDataSource1() {
    //     this.localDatasource1.replace(0, 'This item is replaced!')
    // }
}
