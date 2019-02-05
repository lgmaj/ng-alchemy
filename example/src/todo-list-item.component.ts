import {Component, Input} from "angular-ts-decorators";

@Component({
    selector: 'todoListItem',
    template: `<label class="checkbox">
                <input type="checkbox" ng-model="$ctrl.done">
                <span class="done-{{$ctrl.done}}">{{$ctrl.text}}</span>
            </label>`
})
export class TodoListItemComponent {
    @Input()
    done: boolean;
    @Input()
    text: string;
}