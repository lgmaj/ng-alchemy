# ng-alchemy
```typescript
const alchemy = angularjs => angular;
```

# Motivation
- Code as close as possible to new Angular in AngularJS
- Step by step migration
- Easy to extends 

# How this works
ng-alchemy is a webpack loader. Idea was AOT (ahead of time) based on 2 steps transpilation. 
- In first step ng-alchemy works like preprocessor, will transform code based on configured transformers
- in second step code produce by ng-alchemy will be transpiled by ts-loader, so all ng-alchemy transformation must produce valid TypeScript code

All ng-alchemy transformer can be replaced, extended or removed. That allow easy customization and migration step by step to new code.

Here we have example of  two most important transformers

#### Injection by Type

Injection by type is done by resolve bean names in compilation time.
This part can be full replaced or extended. For example in future we can add naming strategy per module or loading bean name alias for module from external files.

Before transpilation
```typescript
@Injectable()
class Foo {}

@Injectable()
class Bar {}

@Injectable()
class ExampleService {
    constructor(
        @Inject(Foo) private foo: Foo,
        @Inject() private bar: Bar,
        @Inject('$timeout') private $timeout : ITimeoutService,
        @Inject() private $q : any // this options is added for backward compatibilit
    ) {}
}
```
After transpilation
```typescript
@Injectable('Foo')
class Foo {}

@Injectable('Bar')
class Bar {}

@Injectable('ExampleService')
class ExampleService {
    constructor(private foo: Foo,
                private bar: Bar,
                private $timeout : ITimeoutService,
                private $q : any) {}
    
    static $inject : Array<string> = ['Foo', 'Bar', '$timeout', '$q'];
}
```

#### @Component

Component transformer inline binding and templateUrl to decorator.
Allow use new angular template sytax for exmapple: *ngIf, *ngFor, [properyBinding], (eventBinding), [(ngModel)]

Before transpilation

*todo-list-item.component.html*
```html 
<label class="checkbox">
    <input type="checkbox" [(ngModel)]="done">
    <span class="done-{{done}}">{{text}}</span>
    <span class="date">create at: {{formatDate(date)}}</span>
</label>
```

*todo-list-item.component.ts*
```typescript
@Component({
    selector: 'todoListItem',
    templateUrl: `./todo-list-item.component.html`
})
export class TodoListItemComponent {
    @Input('=')
    done: boolean;
    @Input()
    text: string;
    @Input()
    date: Date;

    constructor(@Inject(DateFormatter) private formatter: DateFormatter) {
    }

    formatDate(date: Date): string {
        return this.formatter.format(date);
    }
}
```

After transpilation

*todo-list-item.component.ts*
```typescript
@Component({
    selector: 'todoListItem',
    bindings: { done: '=', text: '<', date: '<' },
    template: `<label class="checkbox">
                   <input type="checkbox" ng-model="$ctrl.done">
                   <span class="done-{{$ctrl.done}}">{{$ctrl.text}}</span>
                   <span class="date">create at: {{$ctrl.formatDate($ctrl.date)}}</span>
               </label>`
})
export class TodoListItemComponent {
    done: boolean;
    text: string;
    date: Date;

    constructor(private formatter: DateFormatter) {
    }

    formatDate(date: Date): string {
        return this.formatter.format(date);
    }
    
    static $inject: Array<string> = ['DateFormatter'];
}
```


#example integration with angular-ts-decorators

example integration with **angular-ts-decorators**

webpack.config.ts

```typescript
import * as path from 'path';
import {optionsBuilder} from "ng-alchemy/loader";
import {Ng1ComponentTransformer, Ng1InjectableTransformer} from "ng-alchemy/compiler";
import {NodeCompilerFileSystem} from "ng-alchemy/node-compiler-file-system";

const ANGULAR_TS_DECORATORS_INTEGRATION = optionsBuilder()
    .addStaticInjectTransformer()
    .addTransformer(new Ng1InjectableTransformer())
    .addTransformer(new Ng1ComponentTransformer())
    .withTemplateLoader(new NodeCompilerFileSystem())
    .withTemplateTranspiler()
    .build('angular-ts-decorators-integration');

export default {
    entry: './src/index.ts',
    output: {
        path:  'dist',
        filename: 'bundle.js'
    },
    mode: "development",
    devtool: "inline-source-map",
    externals: {"angular": "root angular"},
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [{
            test: /\.ts?$/,
            use: [
                {loader: "ts-loader"},
                {
                    loader: 'ng-alchemy',
                    options: {
                        transformers: ANGULAR_TS_DECORATORS_INTEGRATION
                    }
                }
            ]
        }]
    }
};

```
