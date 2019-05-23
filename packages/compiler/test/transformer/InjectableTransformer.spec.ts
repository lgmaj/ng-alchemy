import {compile, crateCompilationUnit, crateCompilerConfig, InjectableTransformer} from "../../src";

describe('InjectableTransformerTest', () => {
    it('should add name from type', function () {
        const input: string = '@Injectable() class Foo {}';
        const output: string = ` class Foo {static ngInjectableDef:any = {name:'Foo'};}`;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new InjectableTransformer())
        );

        expect(result).toEqual(output);
    });

    it('should not change name if already set', function () {
        const input: string = `@Injectable({name:'Bar'}) class Foo {}`;
        const output: string = ` class Foo {static ngInjectableDef:any = {name:'Bar'};}`;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new InjectableTransformer())
        );

        expect(result).toEqual(output);
    });
});