import {platformBrowserDynamic} from "ng-alchemy/platform-browser-dynamic";
import {TodoAppModule} from "./app/todo-app.module";

platformBrowserDynamic().bootstrapModule(TodoAppModule);