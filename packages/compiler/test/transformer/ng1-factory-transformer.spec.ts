import {compile, crateCompilationUnit, crateCompilerConfig, Ng1FactoryTransformer, TranspilerApi} from "../../src";

fdescribe('Ng1FacadeTransformerTest', () => {
    it('should add name from type', function () {
        const input: string = '@Factory() class Foo {}';
        const output: string = ` class Foo {static readonly ngAlchemyFactoryDef: Readonly<{provide:string, useFactory: Function, deps: Array<string>}> = {provide: 'Foo', useFactory: $injector => () => new Foo(), deps: ['$injector]};}`;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1FactoryTransformer()),
            TranspilerApi.empty
        );

        trace(result);

        expect(result).toContain('ngAlchemyFactoryDef');
    });
});


function trace(value: string) : void {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    console.log(value);
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
}