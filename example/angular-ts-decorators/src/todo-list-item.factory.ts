import {Factory, InjectProperty} from 'externals';
import {TodoListItemFormatterService} from "./todo-list-item-formatter.service";

@Factory()
export class TodoListItemFactory {

    @InjectProperty()
    formatter: TodoListItemFormatterService;

    constructor(private text: string,
                private done: boolean) {
    }
}