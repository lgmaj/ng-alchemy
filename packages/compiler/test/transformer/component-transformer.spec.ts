import {compile, ComponentTransformer, crateCompilationUnit, crateCompilerConfig, TranspilerApi} from "../../src";

describe('ComponentTransformerTest', () => {
    it('should remove @Input and @Output and add bindings to component definition', () => {
        const input: string = `@Component({selector:'foo'}) class Foo { @Input() input : string; @Output() output : string;}`;
        const output: string = ` class Foo {  input : string;  output : string;static ngComponentDef:any = {selector:'foo',bindings:{input:'<',output:'&'},controller:Foo};}`;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new ComponentTransformer()),
            TranspilerApi.empty
        );

        expect(result).toEqual(output);
    });
});