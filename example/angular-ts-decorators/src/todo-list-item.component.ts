import {Component, Input} from "angular-ts-decorators";

@Component({
    selector: 'todoListItem',
    template: `<label class="checkbox">
                <input type="checkbox" [(ngModel)]="done">
                <span class="done-{{done}}">{{text}}</span>
            </label>`
})
export class TodoListItemComponent {
    @Input('=')
    done: boolean;
    @Input()
    text: string;
}
