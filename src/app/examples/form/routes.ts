import { Route } from "@angular/router";
import { NumberDirectiveExampleComponent } from "./number-directive/number-directive-example.component";
import { FileValueAccessorExampleComponent } from "./file-value-accessor/file-value-accessor-example.component";
import { ValidationExampleComponent } from "./validation/validation-example.component";

export default [
    {
        path: 'validation',
        component: ValidationExampleComponent,
        title: 'Validation',
    },
    {
        path: 'number-directive',
        component: NumberDirectiveExampleComponent,
        title: 'NumberDirective',
    },
    {
        path: 'file-value-accessor',
        component: FileValueAccessorExampleComponent,
        title: 'FileValueAccessor',
    },
] satisfies Route[];
