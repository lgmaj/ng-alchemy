import * as ts from 'typescript';
import {SyntaxKind} from 'typescript';
import {
    ClassMethodData,
    ClassMethodParameter,
    ClassPropertyData,
    CompilerUnit,
    ConstructorData,
    ConstructorParameter,
    ConstructorParameterDecorator,
    crateCompilationUnit,
    DecoratorArguments,
    DecoratorData,
    PropertyData,
    PropertyDecoratorData,
    TextRange,
    TranspilerApi,
    TSTranspilerClassData,
    TSTranspilerDataBuilder,
    TSTranspilerDataConfig,
    ValueObject,
    ValueObjectProperty
} from "../src";
import {TSTranspiler} from "../src/transpiler";

describe('transpiler spec', () => {

    it('should create data for abstract class', () => {
        const file = `
        abstract class TestAbstractService {
            protected abstractMethod() : void;
            async abstractAsyncMethod(): Promise<void>;
            static staticMethod():number { return 78; }
            protected static protectedStaticMethod():number { return 87; }
        }
        `;

        const data = new TSTranspiler().transpile(crateCompilationUnitMock(file), TranspilerApi.empty);

        expect(data).toEqual(new TSTranspilerDataBuilder()
            .withInput(file)
            .withApi(TranspilerApi.empty)
            .addClass(
                new TSTranspilerClassData(
                    'TestAbstractService',
                    0,
                    289,
                    undefined,
                    [],
                    null
                )
            )
            .addClassMethod(
                new ClassMethodData(
                    'abstractMethod',
                    58, 92,
                    [],
                    [],
                    'void',
                    null,
                    [ts.SyntaxKind.ProtectedKeyword]
                )
            )
            .addClassMethod(
                new ClassMethodData(
                    'abstractAsyncMethod',
                    105, 148,
                    [],
                    [],
                    'Promise<void>',
                    null,
                    [ts.SyntaxKind.AsyncKeyword]
                )
            )
            .addClassMethod(
                new ClassMethodData(
                    'staticMethod',
                    161, 204,
                    [],
                    [],
                    'number',
                    new TextRange(null, 190, 204),
                    [ts.SyntaxKind.StaticKeyword]
                )
            )
            .addClassMethod(
                new ClassMethodData(
                    'protectedStaticMethod',
                    217, 279,
                    [],
                    [],
                    'number',
                    new TextRange(null, 265, 279),
                    [ts.SyntaxKind.ProtectedKeyword, ts.SyntaxKind.StaticKeyword]
                )
            )
            .withConfig(new TSTranspilerDataConfig())
            .build()
        );
    })

    it('should create data for abstract class', () => {
        const file = `
        abstract class TestAbstractService {
            protected abstractMethod() : void;
        }
        `;

        const data = new TSTranspiler().transpile(crateCompilationUnitMock(file), TranspilerApi.empty);

        expect(data).toEqual(new TSTranspilerDataBuilder()
            .withInput(file)
            .withApi(TranspilerApi.empty)
            .addClass(
                new TSTranspilerClassData(
                    'TestAbstractService',
                    0,
                    102,
                    undefined,
                    [],
                    null
                )
            )
            .addClassMethod(
                new ClassMethodData(
                    'abstractMethod',
                    58, 92,
                    [],
                    [],
                    'void',
                    null,
                    [ts.SyntaxKind.ProtectedKeyword]
                )
            )
            .withConfig(new TSTranspilerDataConfig())
            .build()
        );
    })

    it('should create data for constructor parameters', () => {
        const file = `
        class TestClassParams {
            constructor(readonly param1 : Foo,
                        readonly param2 : Array<Bar>) {}
        }
        `;

        const data = new TSTranspiler().transpile(crateCompilationUnitMock(file), TranspilerApi.empty);

        expect(data).toEqual(new TSTranspilerDataBuilder()
            .withInput(file)
            .withApi(TranspilerApi.empty)
            .addClass(
                new TSTranspilerClassData(
                    'TestClassParams',
                    0,
                    146,
                    undefined,
                    [],
                    new ConstructorData(
                        45,
                        136,
                        new TextRange(null, 134, 136)
                    )
                )
            )
            .addClassConstructorParameter(new ConstructorParameter('param1', 'Foo', [ts.SyntaxKind.ReadonlyKeyword]))
            .addClassConstructorParameter(new ConstructorParameter('param2', 'Array<Bar>', [ts.SyntaxKind.ReadonlyKeyword]))
            .withConfig(new TSTranspilerDataConfig())
            .build()
        );
    })

    it('should create data for method params', () => {
        const file = `
        @Injectable()
        class TestService {
            fetch(component: string, params: Array<string>): void {}
            
            @NotEmpty()
            annotatedMethod1() : void {}

            @Transform({param: 'test'})
            annotatedMethod2() : void {}  
            
            untypedMethod() {}
            
            simpleTypedMethod(): int { return 0; }
            typedMethod(): Promise<Array<int>> { return null; }
        }
        `;

        const data = new TSTranspiler().transpile(crateCompilationUnitMock(file), TranspilerApi.empty);

        expect(data).toEqual(new TSTranspilerDataBuilder()
            .withInput(file)
            .withApi(TranspilerApi.empty)
            .addClass(new TSTranspilerClassData('TestService', 0, 463, undefined, [], null))
            .addClassDecorator(new DecoratorData('Injectable', [], '@Injectable()', 9, 22))
            .addClassMethod(
                new ClassMethodData(
                    'fetch',
                    63, 119,
                    [
                        new ClassMethodParameter('component', 'string'),
                        new ClassMethodParameter('params', 'Array<string>')
                    ],
                    [],
                    'void',
                    new TextRange(null, 117, 119),
                    []
                )
            )
            .addClassMethod(
                new ClassMethodData(
                    'annotatedMethod1',
                    145,
                    197,
                    [],
                    [new DecoratorData('NotEmpty', [], '@NotEmpty()', 145, 156)],
                    'void',
                    new TextRange(null, 195, 197),
                    []
                )
            )
            .addClassMethod(new ClassMethodData('annotatedMethod2', 211, 279, [], [
                    new DecoratorData('Transform', [
                        new DecoratorArguments(
                            SyntaxKind.ObjectLiteralExpression,
                            '{param: \'test\'}',
                            222, 237,
                            new ValueObject(222, 237, [
                                new ValueObjectProperty(
                                    null,
                                    223, 236,
                                    new TextRange('param', 223, 228),
                                    new TextRange('\'test\'', 229, 236),
                                    SyntaxKind.StringLiteral)
                            ])
                        )
                    ], '@Transform({param: \'test\'})', 211, 238)
                ],
                'void',
                new TextRange(null, 277, 279),
                []
            ))
            .addClassMethod(
                new ClassMethodData(
                    'untypedMethod',
                    307,
                    325,
                    [],
                    [],
                    null,
                    new TextRange(null, 323, 325),
                    []
                )
            )
            .addClassMethod(
                new ClassMethodData(
                    'simpleTypedMethod',
                    351, 389,
                    [], [],
                    'int',
                    new TextRange(null, 376, 389),
                    []
                )
            )
            .addClassMethod(
                new ClassMethodData(
                    'typedMethod',
                    402, 453,
                    [], [],
                    'Promise<Array<int>>',
                    new TextRange(null, 437, 453),
                    []
                )
            )
            .withConfig(new TSTranspilerDataConfig())
            .build()
        );
    })

    it('should create data', () => {

        const file = `
        @Injectable()
        class TestService {
        }
        
        @Component({selector: 'ng-alchemy-test'})
        class TestComponent {
        
            @Input('=')
            foo : any;
            
            @Output()
            bar : any;
            
            constructor(@Inject() $injector,
                        @Inject('$q') private $q:any,
                        @Inject(TestService) private testService:TestService) {}
            
            $onInit() : void {
            }
            
            $onDestroy() : void {
            }
        }
        
        @Component({selector: 'ng-alchemy-extended-test', template: 'new better component'})
        class ExtendedTestComponent extends TestComponent implements IController {
            $onDestroy() : void {
            }
        }
        `;

        const data = new TSTranspiler().transpile(crateCompilationUnitMock(file), TranspilerApi.empty);

        expect(data).toEqual(new TSTranspilerDataBuilder()
            .withInput(file)
            .withApi(TranspilerApi.empty)
            .addClass(
                new TSTranspilerClassData(
                    'TestService',
                    0,
                    60,
                    undefined,
                    [],
                    null
                )
            )
            .addClassDecorator(new DecoratorData('Injectable', [], '@Injectable()', 9, 22))
            .addClass(new TSTranspilerClassData(
                    'TestComponent',
                    60,
                    585,
                    undefined,
                    [],
                    new ConstructorData(
                        289,
                        456,
                        new TextRange(null, 454, 456)
                    )
                )
            )
            .addClassDecorator(new DecoratorData(
                'Component',
                [
                    new DecoratorArguments(
                        ts.SyntaxKind.ObjectLiteralExpression,
                        `{selector: 'ng-alchemy-test'}`,
                        89, 118,
                        new ValueObject(
                            89, 118,
                            [
                                new ValueObjectProperty(
                                    null, 90, 117,
                                    new TextRange('selector', 90, 98),
                                    new TextRange(`'ng-alchemy-test'`, 99, 117),
                                    ts.SyntaxKind.StringLiteral
                                )
                            ])
                    )
                ],
                `@Component({selector: 'ng-alchemy-test'})`,
                78, 119
            ))
            .addPropertyDecoratorData(new PropertyDecoratorData(
                'Input',
                [new DecoratorArguments(ts.SyntaxKind.StringLiteral, `'='`, 178, 181, null)],
                `@Input('=')`,
                171, 182,
                new PropertyData('foo', 'any')
            ))
            .addPropertyDecoratorData(new PropertyDecoratorData(
                'Output',
                [],
                `@Output()`,
                231, 240,
                new PropertyData('bar', 'any')
            ))
            .addClassConstructorParameter(new ConstructorParameter('$injector', null, []))
            .addClassConstructorParameter(new ConstructorParameter('$q', 'any', [ts.SyntaxKind.PrivateKeyword]))
            .addClassConstructorParameter(new ConstructorParameter('testService', 'TestService', [ts.SyntaxKind.PrivateKeyword]))
            .addClassConstructorParameterDecorator(new ConstructorParameterDecorator(
                'Inject', [],
                '@Inject()', 301, 310,
                new ConstructorParameter('$injector', null, [])
            ))
            .addClassConstructorParameterDecorator(new ConstructorParameterDecorator(
                'Inject',
                [new DecoratorArguments(ts.SyntaxKind.StringLiteral, `'$q'`, 354, 358, null)],
                `@Inject('$q')`, 346, 359,
                new ConstructorParameter('$q', 'any', [ts.SyntaxKind.PrivateKeyword])
            ))
            .addClassConstructorParameterDecorator(new ConstructorParameterDecorator(
                'Inject',
                [new DecoratorArguments(ts.SyntaxKind.Identifier, 'TestService', 408, 419, null)],
                `@Inject(TestService)`, 400, 420,
                new ConstructorParameter('testService', 'TestService', [ts.SyntaxKind.PrivateKeyword])
            ))
            .addClassProperty(new ClassPropertyData('foo', 171, 205))
            .addClassProperty(new ClassPropertyData('bar', 231, 263))
            .addClassMethod(
                new ClassMethodData(
                    '$onInit',
                    482, 514,
                    [], [],
                    'void',
                    new TextRange(null, 499, 514),
                    []
                ))
            .addClassMethod(
                new ClassMethodData(
                    '$onDestroy',
                    540, 575,
                    [], [],
                    'void',
                    new TextRange(null, 560, 575),
                    []
                ))
            .addClass(new TSTranspilerClassData('ExtendedTestComponent', 585, 828, 'TestComponent', ['IController'], null))
            .addClassDecorator(new DecoratorData(
                'Component',
                [
                    new DecoratorArguments(
                        ts.SyntaxKind.ObjectLiteralExpression,
                        `{selector: 'ng-alchemy-extended-test', template: 'new better component'}`,
                        614, 686,
                        new ValueObject(614, 686, [
                            new ValueObjectProperty(
                                null, 615, 651,
                                new TextRange('selector', 615, 623),
                                new TextRange(`'ng-alchemy-extended-test'`, 624, 651),
                                ts.SyntaxKind.StringLiteral
                            ),
                            new ValueObjectProperty(
                                null, 653, 685,
                                new TextRange('template', 652, 661),
                                new TextRange(`'new better component'`, 662, 685),
                                ts.SyntaxKind.StringLiteral
                            )]
                        )
                    )
                ],
                `@Component({selector: 'ng-alchemy-extended-test', template: 'new better component'})`,
                603, 687
            ))
            .addClassMethod(
                new ClassMethodData(
                    '$onDestroy',
                    783,
                    818,
                    [],
                    [],
                    'void',
                    new TextRange(null, 803, 818),
                    []
                )
            )
            .withConfig(new TSTranspilerDataConfig())
            .build()
        );
    });
});

function crateCompilationUnitMock(content ?: string): CompilerUnit {
    return crateCompilationUnit('Foo.ts', content || 'export class Foo {}');
}

