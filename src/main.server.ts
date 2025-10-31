import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = (ctx: BootstrapContext) => bootstrapApplication(AppComponent, config, ctx);

export default bootstrap;
