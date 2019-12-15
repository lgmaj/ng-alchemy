import {
    compile,
    CompilerConfig,
    CompilerFileSystem,
    CompilerUnitTransformer,
    crateCompilationUnit,
    Ng1StaticInjectTransformer,
    SourceTransformation
} from '../compiler';
import {GenericClassDecoratorTransformer} from "../compiler/src/transformer";
import {DecoratorData, TSTranspilerClassData} from "../compiler/src/transpiler/model";
import {registerCompilerFileSystem} from "../compiler/src/filesystem";
import {loader} from "webpack";

const registry: { [key: string]: CompilerConfig } = {};

export default function loader(this: loader.LoaderContext, source: string): string {
    return compile(
        crateCompilationUnit(this.resourcePath, source, this.context),
        getCompilerConfig(this.query)
    )
}

export function registerTransformers(name: string, options: CompilerConfig): void {
    registry[name] = options;
}

function getCompilerConfig(query: any): CompilerConfig {
    if (query && query.transformers && registry[query.transformers]) {
        return registry[query.transformers];
    }

    return new CompilerConfig([new Ng1StaticInjectTransformer()]);
}

class OptionsBuilder {
    private config: CompilerConfig = new CompilerConfig();

    addTransformer(transformer: CompilerUnitTransformer): OptionsBuilder {
        this.config.transformers.push(transformer);
        return this;
    }

    addStaticInjectTransformer(): OptionsBuilder {
        return this.addTransformer(new Ng1StaticInjectTransformer());
    }


    addGenericClassDecoratorTransformer(predicate: (decorator: DecoratorData) => boolean,
                                        factory: (data: TSTranspilerClassData, decorator: DecoratorData) => SourceTransformation): OptionsBuilder {
        return this.addTransformer(new GenericClassDecoratorTransformer(predicate, factory));
    }

    addTemplateTranspiler(): OptionsBuilder {
        this.config.templateTranspiler = true;
        return this;
    }

    addTemplateLoader(fileSystem: CompilerFileSystem): OptionsBuilder {
        registerCompilerFileSystem(fileSystem);
        this.config.templateLoader = true;
        return this;
    }

    build(name: string): string {
        if (this.config.transformers.length > 0) {
            registerTransformers(name, this.config);
        }
        return name;
    }
}

export function optionsBuilder(): OptionsBuilder {
    return new OptionsBuilder();
}