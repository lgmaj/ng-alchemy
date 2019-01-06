import {compile} from "../../src";
import {crateCompilationUnit, crateCompilerConfig} from "../../src/util";
import {Ng1InjectTransformer} from "../../src/transformer/Ng1InjectTransformer";

describe('Ng1InjectTransformerTest', () => {
    it('should transform type to string', function () {
        const input: string = 'class Foo { constructor(@Inject(Bar) bar:Bar) {} }';
        const output: string = `class Foo { constructor(@Inject('Bar') bar:Bar) {} }`;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1InjectTransformer())
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
            constructor(@Inject('A') private a){}
        }
        class C { 
            constructor(@Inject('B') readonly b){}
        }
        `;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1InjectTransformer())
        );

        expect(result).toEqual(output);
    });

    it('should extract class name from import with namespace', function () {
        const input: string = `
        class A { 
            constructor(@Inject(namespace1.Foo1) public foo1){}
        }
        class B { 
            constructor(@Inject(namespace2.Foo2) private foo2){}
        }
        class C { 
            constructor(@Inject(namespace3.Foo3) readonly foo3){}
        }
        `;
        const output: string = `
        class A { 
            constructor(@Inject('Foo1') public foo1){}
        }
        class B { 
            constructor(@Inject('Foo2') private foo2){}
        }
        class C { 
            constructor(@Inject('Foo3') readonly foo3){}
        }
        `;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1InjectTransformer())
        );

        expect(result).toEqual(output);
    });

    it('should deduce type from param type', function () {
        const input: string = `
        class A { 
            constructor(@Inject() public foo1:Foo1){}
        }
        `;
        const output: string = `
        class A { 
            constructor(@Inject('Foo1') public foo1:Foo1){}
        }
        `;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1InjectTransformer())
        );

        expect(result).toEqual(output);
    });

    it('should deduce type from param name if param type is any', function () {
        const input: string = `
        class A { 
            constructor(@Inject() public $q:any){}
        }
        `;
        const output: string = `
        class A { 
            constructor(@Inject('$q') public $q:any){}
        }
        `;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1InjectTransformer())
        );

        expect(result).toEqual(output);
    });

    it('should deduce type from param name if param type not set', function () {
        const input: string = `
        class A { 
            constructor(@Inject() public $q){}
        }
        `;
        const output: string = `
        class A { 
            constructor(@Inject('$q') public $q){}
        }
        `;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1InjectTransformer())
        );

        expect(result).toEqual(output);
    });
});