export declare function Inject(type?: any): ParameterDecorator;

export declare function Input(type?: any): PropertyDecorator;

export declare function Output(type?: any): PropertyDecorator;

export declare function Injectable(): ClassDecorator;

export declare function NgModule(options: {
    providers?: Array<any>;
    declarations?: Array<any>;
    imports?: Array<any>;
    id: string;
}): ClassDecorator;

export declare function Component(options: {
    selector: string;
    template?: string;
    templateUrl?: string;
    bindings?: any;
}): ClassDecorator;


// Facade extension - it's only for angular-ts-decorators

export declare function InjectProperty(type?: any): PropertyDecorator;

export declare function Facade(name?: string): ClassDecorator;

export function provideFacade(type: any): any {
    return type.ngAlchemyFactoryDef;
}
