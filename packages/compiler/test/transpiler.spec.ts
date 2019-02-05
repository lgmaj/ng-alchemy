import {
    ConstructorParameter,
    ConstructorParameterDecorator,
    DecoratorArguments,
    DecoratorData,
    TSTranspiler,
    TSTranspilerDataBuilder
} from "../src/transpiler";
import * as ts from 'typescript';
import {CompilerUnit} from "../src";
import {crateCompilationUnit} from "../src/util";

describe('transpiler spec', () => {

    it('should create data', () => {

        const file = `
        @Injectable()
        class TestService {
        }
        
        @Component({selector: 'ng-alchemy-test'})
        class TestComponent {
            constructor(@Inject() $injector,
                        @Inject('$q') private $q:any,
                        @Inject(TestService) private testService:TestService) {}
        }
        `;

        const data = new TSTranspiler().transpile(crateCompilationUnitMock(file));

        expect(data).toEqual(new TSTranspilerDataBuilder()
            .withInput(file)
            .addClass('TestService', 0, 60)
            .addClassDecorator(new DecoratorData('Injectable', [], '@Injectable()', 9, 22))
            .addClass('TestComponent', 60, 339)
            .addClassDecorator(new DecoratorData(
                'Component',
                [new DecoratorArguments(ts.SyntaxKind.ObjectLiteralExpression, `{selector: 'ng-alchemy-test'}`)],
                `@Component({selector: 'ng-alchemy-test'})`,
                78, 119
            ))
            .addClassConstructorParameterDecorator(new ConstructorParameterDecorator(
                'Inject', [],
                '@Inject()', 174, 183,
                new ConstructorParameter('$injector', null)
            ))
            .addClassConstructorParameterDecorator(new ConstructorParameterDecorator(
                'Inject',
                [new DecoratorArguments(ts.SyntaxKind.StringLiteral, `'$q'`)],
                `@Inject('$q')`, 219, 232,
                new ConstructorParameter('$q', 'any')
            ))
            .addClassConstructorParameterDecorator(new ConstructorParameterDecorator(
                'Inject',
                [new DecoratorArguments(ts.SyntaxKind.Identifier, 'TestService')],
                `@Inject(TestService)`, 273, 293,
                new ConstructorParameter('testService', 'TestService')
            ))
            .build()
        );
    });
});

function crateCompilationUnitMock(content ?: string): CompilerUnit {
    return crateCompilationUnit(name || 'Foo.ts', content || 'export class Foo {}');
}

