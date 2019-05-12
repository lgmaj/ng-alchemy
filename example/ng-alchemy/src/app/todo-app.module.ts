import {NgModule} from 'ng-alchemy/core';
import {TodoListModule} from "./list/todo-list.module";

@NgModule({
    id: 'todoApp',
    imports: [TodoListModule]
})
export class TodoAppModule {
}