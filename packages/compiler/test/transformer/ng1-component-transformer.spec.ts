import {compile, crateCompilationUnit, crateCompilerConfig, Ng1ComponentTransformer} from "../../src";

describe('Ng1ComponentTransformerTest', () => {
    it('should remove @Input and @Output and add bindings to component definition', () => {
        const input: string = `@Component({selector:'foo'}) class Foo { @Input() input : string; @Output() output : string;}`;
        const output: string = `@Component({selector:'foo',bindings:{input:'<',output:'&'}}) class Foo {  input : string;  output : string;}`;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1ComponentTransformer())
        );

        expect(result).toEqual(output);
    });
    it('should remove @Input and @Output and add bindings to component definition do not add an unnecessary comma', () => {
        const input: string = '@Component({}) class Foo { @Input() input : string; @Output() output : string;}';
        const output: string = `@Component({bindings:{input:'<',output:'&'}}) class Foo {  input : string;  output : string;}`;

        const result = compile(
            crateCompilationUnit('Foo.ts', input),
            crateCompilerConfig(new Ng1ComponentTransformer())
        );

        expect(result).toEqual(output);
    });
});