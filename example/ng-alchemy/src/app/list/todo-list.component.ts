import {Todo} from "./Todo";
import {TodoListService} from "./todo-list.service";
import {Component, Inject} from "ng-alchemy/core";

@Component({
    selector: 'todoListComponent',
    templateUrl: './todo-list.component.html'
})
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
        this.todos = this.todos.filter(todo => !todo.done);
    }
}