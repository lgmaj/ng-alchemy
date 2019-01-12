import {Todo} from "./Todo";

export class TodoListService {
    load(): Array<Todo> {
        return [
            {text: 'learn AngularJS', done: true},
            {text: 'build an AngularJS app', done: false}
        ];
    }
}