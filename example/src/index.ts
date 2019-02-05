import {TodoListService} from "./todo-list.service";
import {TodoListComponent} from "./todo-list.component";
import {NgModule} from "angular-ts-decorators";
import {TodoListItemComponent} from "./todo-list-item.component";

@NgModule({
    id: 'todoApp',
    providers: [TodoListService],
    declarations: [TodoListComponent, TodoListItemComponent]
})
class TodoAppModule {
}