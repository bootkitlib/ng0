import { Route } from "@angular/router";
import { NumberDirectiveExampleComponent } from "./number-directive/number-directive-example.component";

export default [
    {
        path: 'number-directive',
        component: NumberDirectiveExampleComponent,
    }
] satisfies Route[];
