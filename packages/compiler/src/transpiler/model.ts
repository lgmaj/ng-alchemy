import * as ts from "typescript";
import {getIdentifier, getModifiers} from "./util";

export class PropertyData {
    constructor(readonly name: string,
                readonly type: string) {
    }

    static fromTsSource(property: ts.PropertyDeclaration,
                        source: ts.SourceFile): PropertyData {
        return new PropertyData(
            getIdentifier(property.name),
            property.type ? property.type.getText(source) : null
        );
    }
}

export class ConstructorParameter {
    constructor(readonly name: string,
                readonly type: string,
                readonly modifiers: Array<number>) {
    }

    static fromTsSource(param: ts.ParameterDeclaration,
                        source: ts.SourceFile) {
        return new ConstructorParameter(
            getIdentifier(param.name),
            param.type ? param.type.getText(source) : null,
            getModifiers(param)
        );
    }
}

export class DecoratorArguments {
    constructor(readonly kind: ts.SyntaxKind,
                readonly text: string) {
    }

    static fromTsSource(arg: any, source: ts.SourceFile): DecoratorArguments {
        return new DecoratorArguments(
            arg.kind,
            arg.getText(source)
        );
    }
}

export class TextRange {
    constructor(readonly text: string,
                readonly start: number,
                readonly end: number) {
    }
}

export class DecoratorData extends TextRange {
    constructor(readonly name: string,
                readonly args: Array<DecoratorArguments>,
                text: string,
                start: number,
                end: number) {
        super(text, start, end);
    }

    static fromTsSource(decorator: ts.Decorator,
                        args: Array<any>,
                        source: ts.SourceFile): DecoratorData {
        const exp: any = decorator.expression;
        return new DecoratorData(
            exp.expression.text,
            args.map(arg => DecoratorArguments.fromTsSource(arg, source)),
            decorator.getText(source),
            decorator.getStart(source),
            decorator.getEnd()
        );
    }
}

export class PropertyDecoratorData extends TextRange {
    constructor(readonly name: string,
                readonly args: Array<DecoratorArguments>,
                text: string,
                start: number,
                end: number,
                readonly propert: PropertyData) {
        super(text, start, end);
    }

    static fromTsSource(decorator: ts.Decorator,
                        args: Array<any>,
                        property: ts.PropertyDeclaration,
                        source: ts.SourceFile): PropertyDecoratorData {
        const exp: any = decorator.expression;
        return new PropertyDecoratorData(
            exp.expression.text,
            args.map(arg => DecoratorArguments.fromTsSource(arg, source)),
            decorator.getText(source),
            decorator.getStart(source),
            decorator.getEnd(),
            PropertyData.fromTsSource(property, source)
        );
    }
}

export class ConstructorParameterDecorator extends TextRange {
    constructor(readonly name: string,
                readonly args: Array<DecoratorArguments>,
                text: string,
                start: number,
                end: number,
                readonly parameter: ConstructorParameter) {
        super(text, start, end);
    }

    static fromTsSource(decorator: ts.Decorator,
                        args: Array<any>,
                        param: ts.ParameterDeclaration,
                        source: ts.SourceFile): ConstructorParameterDecorator {
        const exp: any = decorator.expression;
        return new ConstructorParameterDecorator(
            exp.expression.text,
            args.map(arg => DecoratorArguments.fromTsSource(arg, source)),
            decorator.getText(source),
            decorator.getStart(source),
            decorator.getEnd(),
            ConstructorParameter.fromTsSource(param, source)
        );
    }
}

export class ClassMethodData {
    constructor(readonly name: string,
                readonly start: number,
                readonly end: number) {
    }

    static fromTsSource(method: ts.MethodDeclaration, source: ts.SourceFile) {
        return new ClassMethodData(
            getIdentifier(method.name),
            method.getStart(source),
            method.getEnd()
        );
    }
}

export class TSTranspilerClassData {
    readonly decorator: Array<DecoratorData> = [];
    readonly propertyDecorator: Array<PropertyDecoratorData> = [];
    readonly constructorParameterDecorator: Array<ConstructorParameterDecorator> = [];

    readonly methods: Array<ClassMethodData> = [];

    constructor(readonly name: string,
                readonly start: number,
                readonly end: number) {
    }
}

export interface TSTranspilerData {
    input: string;
    classList: Array<TSTranspilerClassData>;
}

export class TSTranspilerDataBuilder {

    private data: TSTranspilerData = {input: '', classList: []};
    private current: TSTranspilerClassData = null;

    withInput(value: string): TSTranspilerDataBuilder {
        this.data.input = value;
        return this;
    }

    addClass(name: string, start: number, end: number): TSTranspilerDataBuilder {
        this.data.classList.push(new TSTranspilerClassData(name, start, end));
        this.current = this.data.classList[this.data.classList.length - 1];
        return this;
    }

    addClassDecorator(decorator: DecoratorData): TSTranspilerDataBuilder {
        this.current.decorator.push(decorator);
        return this;
    }

    addPropertyDecoratorData(decorator: PropertyDecoratorData): TSTranspilerDataBuilder {
        this.current.propertyDecorator.push(decorator);
        return this;
    }

    addClassConstructorParameterDecorator(decorator: ConstructorParameterDecorator): TSTranspilerDataBuilder {
        this.current.constructorParameterDecorator.push(decorator);
        return this;
    }

    addClassMethod(method: ClassMethodData): TSTranspilerDataBuilder {
        this.current.methods.push(method);
        return this;
    }

    build(): TSTranspilerData {
        return this.data;
    }
}

