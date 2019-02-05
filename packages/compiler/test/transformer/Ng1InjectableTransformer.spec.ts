import {compile} from "../../src";
import {crateCompilationUnit, crateCompilerConfig} from "../../src/util";
import {Ng1InjectableTransformer} from "../../src/transformer/Ng1InjectableTransformer";

describe('Ng1InjectableTransformerTest', () => {
    it('should add name from type', function () {
        const input: string = '@Injectable() class Foo {}';
        const output: string = `@Injectable('Foo') class Foo {}`;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1InjectableTransformer())
        );

        expect(result).toEqual(output);
    });

    it('should not change name if already set', function () {
        const input: string = `@Injectable('Bar') class Foo {}`;
        const output: string = `@Injectable('Bar') class Foo {}`;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1InjectableTransformer())
        );

        expect(result).toEqual(output);
    });

    it('should add name from type for many Injectable on one class', function () {
        const input: string = `@Injectable() @Injectable('Bar') class Foo {}`;
        const output: string = `@Injectable('Foo') @Injectable('Bar') class Foo {}`;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1InjectableTransformer())
        );

        expect(result).toEqual(output);
    });
});