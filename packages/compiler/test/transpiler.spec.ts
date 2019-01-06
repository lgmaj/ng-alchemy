import {
    ConstructorParameter,
    ConstructorParameterDecorator, DecoratorArguments,
    TSTranspiler,
    TSTranspilerDataBuilder
} from "../src/transpiler";
import * as ts from 'typescript';

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

        const data = new TSTranspiler().transpile(file);

        expect(data).toEqual(new TSTranspilerDataBuilder()
            .withInput(file)
            .addClass('TestService')
            .addClassDecorator('Injectable')
            .addClass('TestComponent')
            .addClassDecorator('Component')
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
