import * as ts from 'typescript';
import {CompilerUnit, crateCompilationUnit} from "../src";
import {TSTranspiler} from "../src/transpiler";
import {
    ClassMethodData,
    ConstructorParameter,
    ConstructorParameterDecorator,
    DecoratorArguments,
    DecoratorData, PropertyData, PropertyDecoratorData,
    TSTranspilerDataBuilder
} from "../src/transpiler/model";

describe('transpiler spec', () => {

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
        `;

        const data = new TSTranspiler().transpile(crateCompilationUnitMock(file));

        expect(data).toEqual(new TSTranspilerDataBuilder()
            .withInput(file)
            .addClass('TestService', 0, 60)
            .addClassDecorator(new DecoratorData('Injectable', [], '@Injectable()', 9, 22))
            .addClass('TestComponent', 60, 585)
            .addClassDecorator(new DecoratorData(
                'Component',
                [new DecoratorArguments(ts.SyntaxKind.ObjectLiteralExpression, `{selector: 'ng-alchemy-test'}`)],
                `@Component({selector: 'ng-alchemy-test'})`,
                78, 119
            ))
            .addPropertyDecoratorData(new PropertyDecoratorData(
                'Input',
                [new DecoratorArguments(ts.SyntaxKind.StringLiteral, `'='`)],
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
            .addClassConstructorParameterDecorator(new ConstructorParameterDecorator(
                'Inject', [],
                '@Inject()', 301, 310,
                new ConstructorParameter('$injector', null, [])
            ))
            .addClassConstructorParameterDecorator(new ConstructorParameterDecorator(
                'Inject',
                [new DecoratorArguments(ts.SyntaxKind.StringLiteral, `'$q'`)],
                `@Inject('$q')`, 346, 359,
                new ConstructorParameter('$q', 'any', [ts.SyntaxKind.PrivateKeyword])
            ))
            .addClassConstructorParameterDecorator(new ConstructorParameterDecorator(
                'Inject',
                [new DecoratorArguments(ts.SyntaxKind.Identifier, 'TestService')],
                `@Inject(TestService)`, 400, 420,
                new ConstructorParameter('testService', 'TestService', [ts.SyntaxKind.PrivateKeyword])
            ))
            .addClassMethod(new ClassMethodData('$onInit', 482, 514))
            .addClassMethod(new ClassMethodData('$onDestroy', 540, 575))
            .build()
        );
    });
});

function crateCompilationUnitMock(content ?: string): CompilerUnit {
    return crateCompilationUnit(name || 'Foo.ts', content || 'export class Foo {}');
}

