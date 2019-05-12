import {NgModule} from 'ng-alchemy/core';
import {TodoListService} from "./todo-list.service";
import {TodoListComponent} from "./todo-list.component";
import {TodoListItemComponent} from "./todo-list-item.component";

@NgModule({
    id: 'todoListModule',
    providers: [TodoListService],
    declarations: [TodoListComponent, TodoListItemComponent]
})
export class TodoListModule {
}