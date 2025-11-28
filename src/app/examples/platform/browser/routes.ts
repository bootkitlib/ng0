import { Route } from "@angular/router";
import { IntersectionObserverExampleComponent } from "./intersection-observer/intersection-observer-example.component";

export default [
    {
        path: 'intersection-observer',
        title: 'Browser',
        component: IntersectionObserverExampleComponent,
    }
] satisfies Route[];
