import {
    compile,
    CompilerUnitTransformer,
    crateCompilationUnit,
    crateCompilerConfigFromArray,
    Ng1StaticInjectTransformer,
    SourceTransformation
} from '../compiler';
import {GenericClassDecoratorTransformer} from "../compiler/src/transformer";
import {DecoratorData, TSTranspilerClassData} from "../compiler/src/transpiler/model";

const registry: { [key: string]: Array<CompilerUnitTransformer> } = {};

export default function loader(source): string {
    return compile(
        crateCompilationUnit(this.resourcePath, source, this.context),
        crateCompilerConfigFromArray(getTransformers(this.query))
    )
}

export function registerTransformers(name: string, transformer: Array<CompilerUnitTransformer>): void {
    registry[name] = transformer;
}

function getTransformers(query): Array<CompilerUnitTransformer> {
    if (query && query.transformers && registry[query.transformers]) {
        return registry[query.transformers];
    }

    return [new Ng1StaticInjectTransformer()];
}

class OptionsBuilder {
    private transformers: Array<CompilerUnitTransformer> = [];

    addTransformer(transformer: CompilerUnitTransformer): OptionsBuilder {
        this.transformers.push(transformer);
        return this;
    }

    addStaticInjectTransformer(): OptionsBuilder {
        return this.addTransformer(new Ng1StaticInjectTransformer());
    }


    addGenericClassDecoratorTransformer(predicate: (decorator: DecoratorData) => boolean,
                                        factory: (data: TSTranspilerClassData, decorator: DecoratorData) => SourceTransformation): OptionsBuilder {
        return this.addTransformer(new GenericClassDecoratorTransformer(predicate, factory));
    }

    build(name: string): string {
        if (this.transformers.length > 0) {
            registerTransformers(name, this.transformers);
        }
        return name;
    }
}

export function optionsBuilder(): OptionsBuilder {
    return new OptionsBuilder();
}