import { Route } from "@angular/router";
import { LocalizationExampleComponent } from "./localization-example.component";
import { FormattersExampleComponent } from "./formatters/formatters-example.component";

export default [
    {
        path: '',
        component: LocalizationExampleComponent,
    },
    {
        path: 'formatters',
        title: 'Formatters',
        component: FormattersExampleComponent,
    },
] satisfies Route[];
