import {Todo} from "./Todo";
import {Injectable} from "angular-ts-decorators";

@Injectable()
export class TodoListService {
    load(): Array<Todo> {
        return [
            {text: 'learn AngularJS', done: true},
            {text: 'build an AngularJS app', done: false}
        ];
    }
}