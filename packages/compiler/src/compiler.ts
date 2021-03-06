import {CompilerConfig, CompilerUnit, CompilerUnitTransformer, SourceTransformation, TranspilerApi} from "./public_api";
import {TSTranspiler} from "./transpiler";
import {replaceRange} from "./util";
import {TSTranspilerData, TSTranspilerDataConfig} from "./transpiler/model";

export function compile(unit: CompilerUnit, config: CompilerConfig, api: TranspilerApi): string {
    assertCompilerInput(unit, config);
    return config.transformers
        .reduce(
            (context, transformer) => context.transform(transformer),
            CompilerContext.create(unit, api, new TSTranspilerDataConfig(config.template))
        )
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
            .filter((value: SourceTransformation, index: number, collection: Array<SourceTransformation>) => index > 0 ? !value.equal(collection[index - 1]) : true)
            .reduce(
                (input, transform) => replaceRange(input, transform.start, transform.end, transform.text),
                this.data.input
            );
    }

    static create(unit: CompilerUnit, api: TranspilerApi, config: TSTranspilerDataConfig): CompilerContext {
        return new CompilerContext(new TSTranspiler().transpile(unit, api, config));
    }
}
