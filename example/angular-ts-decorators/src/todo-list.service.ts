import {Todo} from "./Todo";
import {Injectable} from "angular-ts-decorators";
import {Inject} from "externals";
import {TodoListItemFactory} from "./todo-list-item.factory";

@Injectable()
export class TodoListService {

    constructor(@Inject(TodoListItemFactory) private itemFactory: any) {
    }

    load(): Array<Todo> {
        return [
            new this.itemFactory('learn AngularJS', true),
            new this.itemFactory('build an AngularJS app', false)
        ];
    }
}