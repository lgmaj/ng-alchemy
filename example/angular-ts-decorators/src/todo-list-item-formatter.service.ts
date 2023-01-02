import {Injectable} from "angular-ts-decorators";

@Injectable()
export class TodoListItemFormatterService {

    format(item: any): string {
        return `<span>${item.label}</span>`
    }
}