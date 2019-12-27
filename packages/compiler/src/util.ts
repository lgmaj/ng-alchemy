import {CompilerConfig, CompilerTemplateConfig, CompilerUnit, CompilerUnitTransformer} from "./public_api";

export function crateCompilationUnit(name: string, content: string, path: string = null): CompilerUnit {
    return {name, path, content}
}

export function crateCompilerConfig(...transformer: Array<CompilerUnitTransformer>): CompilerConfig {
    return crateCompilerConfigFromArray(transformer, false, false);
}

export function crateCompilerConfigFromArray(transformers: Array<CompilerUnitTransformer>, templateLoader: boolean = false, templateTranspiler: boolean = false): CompilerConfig {
    return new CompilerConfig(transformers, new CompilerTemplateConfig(templateLoader, templateTranspiler));
}

export function replaceRange(input: string, start: number, end: number, text: string): string {
    return input.substring(0, start) + text + input.substring(end);
}

export function extractClassName(value: string): string {
    return value.split('.').pop();
}