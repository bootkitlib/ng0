import { Route } from "@angular/router";
import { NumberDirectiveExampleComponent } from "./number-directive/number-directive-example.component";
import { FileValueAccessorExampleComponent } from "./file-value-accessor/file-value-accessor-example.component";

export default [
    {
        path: 'number-directive',
        component: NumberDirectiveExampleComponent,
    },
    {
        path: 'file-value-accessor',
        component: FileValueAccessorExampleComponent,
    },
] satisfies Route[];
