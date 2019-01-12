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
        static $inject:Array<string> = ['$q','$timeout','Foo','Bar','Baz'];}
        `;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1StaticInjectTransformer())
        );

        expect(result).toEqual(output);
    });

    it('should transform many inject', function () {
        const input: string = `
        class A { 
            constructor(){}
        }
        class B { 
            constructor(@Inject(A) private a){}
        }
        class C { 
            constructor(@Inject(B) readonly b){}
        }
        `;
        const output: string = `
        class A { 
            constructor(){}
        }
        class B { 
            constructor( private a){}
        static $inject:Array<string> = ['A'];}
        class C { 
            constructor( readonly b){}
        static $inject:Array<string> = ['B'];}
        `;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1StaticInjectTransformer())
        );

        expect(result).toEqual(output);
    });
});