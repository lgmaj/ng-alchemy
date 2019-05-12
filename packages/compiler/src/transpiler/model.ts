import * as ts from "typescript";
import {first, getHeritageClauses, getIdentifier, getModifiers} from "./util";

export class TextRange {
    constructor(readonly text: string,
                readonly start: number,
                readonly end: number) {
    }
}

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

export class DecoratorArguments extends TextRange {
    constructor(
        readonly kind: ts.SyntaxKind,
        text: string,
        start: number,
        end: number,
        readonly value: Value) {
        super(text, start, end)
    }

    static fromTsSource(arg: any, source: ts.SourceFile): DecoratorArguments {
        return new DecoratorArguments(
            arg.kind,
            arg.getText(source),
            arg.getStart(source),
            arg.getEnd(),
            valueFactory(arg, source)
        );
    }
}

function valueFactory(arg: any, source: ts.SourceFile): Value {
    switch (arg.kind) {
        case ts.SyntaxKind.ObjectLiteralExpression:
            return ValueObject.fromTsSource(arg, source);
        default:
            return null;
    }
}

export interface Value {
}

export class ValueObject extends TextRange implements Value {

    constructor(
        start: number,
        end: number,
        readonly properties: Array<ValueObjectProperty>) {
        super(null, start, end)
    }

    static fromTsSource(arg: any, source: ts.SourceFile): ValueObject {
        return new ValueObject(
            arg.pos,
            arg.end,
            arg.properties ? arg.properties.map(property => {
                return ValueObjectProperty.fromTsSource(property, source)
            }) : []);
    }
}

export class ValueObjectProperty extends TextRange {
    constructor(text: string,
                start: number,
                end: number,
                readonly name: TextRange,
                readonly initializer: TextRange) {
        super(text, start, end);
    }

    static fomNameInitializer(name: string, initializer: string): ValueObjectProperty {
        return new ValueObjectProperty(
            null,
            -1,
            -1,
            new TextRange(name, -1, -1),
            new TextRange(initializer, -1, -1)
        );
    }

    static fromTsSource(property: any, source: ts.SourceFile): ValueObjectProperty {
        return new ValueObjectProperty(
            null,
            property.getStart(source),
            property.getEnd(),
            new TextRange(
                property.name.getText(source),
                property.name.pos,
                property.name.end
            ),
            new TextRange(
                property.initializer.getText(source),
                property.initializer.pos,
                property.initializer.end
            )
        );
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
                readonly end: number,
                readonly extendsOf: string,
                readonly implementsOf: Array<string>) {
    }

    static fromTsSource(node: ts.ClassDeclaration): TSTranspilerClassData {
        return new TSTranspilerClassData(
            node.name.text,
            node.pos,
            node.end,
            first(getHeritageClauses(node, ts.SyntaxKind.ExtendsKeyword)),
            getHeritageClauses(node, ts.SyntaxKind.ImplementsKeyword)
        );
    }
}

export interface TSTranspilerData {
    input: string;
    path: string;
    classList: Array<TSTranspilerClassData>;
}

export class TSTranspilerDataBuilder {

    private data: TSTranspilerData = {input: '', path: null, classList: []};
    private current: TSTranspilerClassData = null;

    withInput(value: string): TSTranspilerDataBuilder {
        this.data.input = value;
        return this;
    }

    withPath(value: string): TSTranspilerDataBuilder {
        this.data.path = value;
        return this;
    }

    addClass(clazz: TSTranspilerClassData): TSTranspilerDataBuilder {
        this.data.classList.push(clazz);
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

