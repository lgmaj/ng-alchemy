import {
    compile,
    CompilerUnitTransformer,
    crateCompilationUnit,
    crateCompilerConfigFromArray,
    Ng1StaticInjectTransformer
} from '../compiler';

const registry: {[key: string]: Array<CompilerUnitTransformer>}  = {};

export default function loader(source): string {
    return compile(
        crateCompilationUnit(this.resourcePath, source),
        crateCompilerConfigFromArray(getTransformers(this.query))
    )
}

export function registerTranformers(name: string, transformer: Array<CompilerUnitTransformer>): void {
    registry[name] = transformer;
}

function getTransformers(query): Array<CompilerUnitTransformer> {
    if (query && query.transformers && registry[query.transformers]) {
        return registry[query.transformers];
    }

    return [new Ng1StaticInjectTransformer()];
}