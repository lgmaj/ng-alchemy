import {Todo} from "./Todo";
import {TodoListService} from "./TodoListService";
import {Inject} from "./externals";

export class TodoListComponent {

    todos: Array<Todo>;
    todoText: string = '';

    constructor(@Inject(TodoListService) private service: TodoListService) {
    }

    $onInit(): void {
        this.todos = this.service.load();
    }

    addTodo(): void {
        this.todos.push({text: this.todoText, done: false});
        this.todoText = '';
    }

    remaining(): number {
        return this.todos
            .map(todo => todo.done ? 0 : 1)
            .reduce((count, value) => count + value, 0);
    }

    archive() {
        const oldTodos = this.todos;
        this.todos = oldTodos.filter(todo => !todo.done);
    }
}

export const TODO_LIST_COMPONENT_TEMPLATE: string = `
<h2>Todo</h2>
<div>
    <span>{{$ctrl.remaining()}} of {{$ctrl.todos.length}} remaining</span>
    [ <a href="" ng-click="$ctrl.archive()">archive</a> ]
    <ul class="unstyled">
        <li ng-repeat="todo in $ctrl.todos">
            <label class="checkbox">
                <input type="checkbox" ng-model="todo.done">
                <span class="done-{{todo.done}}">{{todo.text}}</span>
            </label>
        </li>
    </ul>
    <form ng-submit="$ctrl.addTodo()">
        <input type="text" ng-model="$ctrl.todoText"  size="30"
               placeholder="add new todo here">
        <input class="btn-primary" type="submit" value="add">
    </form>
</div>
`;