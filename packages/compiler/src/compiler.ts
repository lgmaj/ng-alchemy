import {CompilerConfig, CompilerUnit, CompilerUnitTransformer, SourceTransformation} from "./public_api";
import {TSTranspiler} from "./transpiler";
import {replaceRange} from "./util";
import {TSTranspilerData} from "./transpiler/model";

export function compile(unit: CompilerUnit, config: CompilerConfig): string {
    assertCompilerInput(unit, config);
    return config.transformers
        .reduce((context, transformer) => context.transform(transformer), CompilerContext.create(unit))
        .execute();
}

function assertCompilerInput(unit: CompilerUnit, config: CompilerConfig): void {
    if (!unit)
        throw Error(compilerError('compilation unit can\'t be null!'));
    if (!config)
        throw Error(compilerError('config can\'t be null!'));
}

function compilerError(value: string): string {
    return `[ng-alchemy][error] ${value}`;
}

class CompilerContext {

    private transformations: Array<SourceTransformation> = [];

    private constructor(private data: TSTranspilerData) {
    }

    transform(transformer: CompilerUnitTransformer): CompilerContext {
        this.transformations = this.transformations.concat(transformer.transform(this.data));
        return this;
    }

    execute(): string {
        return this.transformations
            .sort((a, b) => b.start - a.start)
            .reduce(
                (input, transform) => replaceRange(input, transform.start, transform.end, transform.text),
                this.data.input
            );
    }

    static create(unit: CompilerUnit): CompilerContext {
        return new CompilerContext(new TSTranspiler().transpile(unit));
    }
}