import {compile} from "../../src";
import {crateCompilationUnit, crateCompilerConfig} from "../../src/util";
import {Ng1StaticInjectTransformer} from "../../src/transformer/Ng1StaticInjectTransformer";

describe('Ng1StaticInjectTransformerTest', () => {
    it('should deduce type from param type', function () {
        const input: string = `
        class A { 
            constructor(@Inject() public $q,
                        @Inject() public $timeout:any,
                        @Inject() public foo1:Foo,
                        @Inject(Bar) public foo1:Bar,
                        @Inject('Baz') public foo1:Baz){}
        }
        `;
        const output: string = `
        class A { 
            constructor( public $q,
                         public $timeout:any,
                         public foo1:Foo,
                         public foo1:Bar,
                         public foo1:Baz){}
        }A.$inject = ['$q','$timeout','Foo','Bar','Baz'];
        `;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1StaticInjectTransformer())
        );

        expect(result).toEqual(output);
    });
});