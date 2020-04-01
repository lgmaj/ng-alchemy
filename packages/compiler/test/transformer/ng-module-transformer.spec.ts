import {compile, crateCompilationUnit, crateCompilerConfig, NgModuleTransformer, TranspilerApi} from "../../src";

describe('NgModuleTransformerTest', () => {
    it('should add static ngModule def and remove decorator', () => {
        const input: string = '@NgModule({id:"ngAlchemyTestModule"}) class Foo {}';
        const output: string = ` class Foo {static ngModuleDef:any = {id:"ngAlchemyTestModule"};}`;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new NgModuleTransformer()),
            TranspilerApi.empty
        );

        expect(result).toEqual(output);
    })
});