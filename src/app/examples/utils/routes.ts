import { Route } from "@angular/router";
import { CounterExampleComponent } from "./counter/counter-example.component";


export default [
    {
        path: 'counter',
        component: CounterExampleComponent,
    }
] satisfies Route[];
