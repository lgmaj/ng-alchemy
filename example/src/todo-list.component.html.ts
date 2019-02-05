export const TODO_LIST_COMPONENT_TEMPLATE: string = `
<h2>Todo</h2>
<div>
    <span>{{$ctrl.remaining()}} of {{$ctrl.todos.length}} remaining</span>
    [ <a href="" ng-click="$ctrl.archive()">archive</a> ]
    <ul class="unstyled">
        <li ng-repeat="todo in $ctrl.todos">
            <todo-list-item done="todo.done" text="todo.text"></todo-list-item>
        </li>
    </ul>
    <form ng-submit="$ctrl.addTodo()">
        <input type="text" ng-model="$ctrl.todoText"  size="30"
               placeholder="add new todo here">
        <input class="btn-primary" type="submit" value="add">
    </form>
</div>
`;