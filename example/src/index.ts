import {TodoListService} from "./TodoListService";
import {TODO_LIST_COMPONENT_TEMPLATE, TodoListComponent} from "./TodoListComponent";


declare const angular: any;

angular.module('todoApp', [])
    .service('TodoListService', TodoListService)
    .component('todoListComponent', {
        template: TODO_LIST_COMPONENT_TEMPLATE,
        controller: TodoListComponent
    });