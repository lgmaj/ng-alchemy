import {Todo} from "./Todo";
import {TodoListService} from "./todo-list.service";
import {Inject} from "./externals";
import {Component} from "angular-ts-decorators";
import {TODO_LIST_COMPONENT_TEMPLATE} from "./todo-list.component.html";

@Component({
    selector: 'todoListComponent',
    template: TODO_LIST_COMPONENT_TEMPLATE
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