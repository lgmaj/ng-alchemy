import {
    compile,
    CompilerConfig,
    CompilerFileSystem,
    CompilerTemplateConfig,
    CompilerUnitTransformer,
    crateCompilationUnit,
    DecoratorData,
    Ng1StaticInjectTransformer,
    SourceTransformation,
    TranspilerApi,
    TSTranspilerClassData
} from "../compiler";
import {GenericClassDecoratorTransformer} from "../compiler/src/transformer";
import {registerCompilerFileSystem} from "../compiler/src/filesystem";
import {LoaderContext} from "webpack";
import {LoaderOptions} from "ts-loader/dist/interfaces";

const registry: { [key: string]: CompilerConfig } = {};

export default function loader(this: LoaderContext<LoaderOptions>, source: string): string {
    return compile(
        crateCompilationUnit(this.resourcePath, source, this.context),
        getCompilerConfig(this.query),
        new TranspilerApi(this.addDependency)
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

    withTemplateTranspiler(): OptionsBuilder {
        this.config.template = new CompilerTemplateConfig(
            this.config.template.load, true, this.config.template.optimize
        );
        return this;
    }

    withTemplateLoader(fileSystem: CompilerFileSystem): OptionsBuilder {
        registerCompilerFileSystem(fileSystem);
        this.config.template = new CompilerTemplateConfig(
            true, this.config.template.transpile, this.config.template.optimize
        );
        return this;
    }

    withOptimizedTemplate(): OptionsBuilder {
        this.config.template = new CompilerTemplateConfig(
            this.config.template.load, this.config.template.transpile, true
        );
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
