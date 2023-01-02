import {TodoListService} from "./todo-list.service";
import {TodoListComponent} from "./todo-list.component";
import {NgModule} from "angular-ts-decorators";
import {TodoListItemComponent} from "./todo-list-item.component";
import {TodoListItemFactory} from "./todo-list-item.factory";
import {TodoListItemFormatterService} from "./todo-list-item-formatter.service";

@NgModule({
    id: 'todoApp',
    providers: [TodoListService, TodoListItemFormatterService, provideFacade(TodoListItemFactory)],
    declarations: [TodoListComponent, TodoListItemComponent]
})
class TodoAppModule {
}

function provideFacade(type: any): any {
    return type.ngAlchemyFactoryDef;
}