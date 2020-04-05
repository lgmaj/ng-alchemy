import {compile, crateCompilationUnit, crateCompilerConfig, TranspilerApi, update} from '../../src';
import {GenericClassDecoratorTransformer} from "../../src/transformer";

const generic = new GenericClassDecoratorTransformer(
    d => d.name === 'Injectable' && d.args.length === 0,
    (c, d) => update(`@Injectable('${c.name}')`, d)
);

describe('GenericClassDecoratorTransformerTest', () => {
    it('should add name from type', function () {
        const input: string = '@Injectable() class Foo {}';
        const output: string = `@Injectable('Foo') class Foo {}`;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(generic),
            TranspilerApi.empty
        );

        expect(result).toEqual(output);
    });

    it('should not change name if already set', function () {
        const input: string = `@Injectable('Bar') class Foo {}`;
        const output: string = `@Injectable('Bar') class Foo {}`;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(generic),
            TranspilerApi.empty
        );

        expect(result).toEqual(output);
    });

    it('should add name from type for many Injectable on one class', function () {
        const input: string = `@Injectable() @Injectable('Bar') class Foo {}`;
        const output: string = `@Injectable('Foo') @Injectable('Bar') class Foo {}`;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(generic),
            TranspilerApi.empty
        );

        expect(result).toEqual(output);
    });
});