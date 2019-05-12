import {Component, Input} from "ng-alchemy/core";

@Component({
    selector: 'todoListItem',
    templateUrl: './todo-list-item.component.html'
})
export class TodoListItemComponent {
    @Input('=')
    done: boolean;
    @Input()
    text: string;
}