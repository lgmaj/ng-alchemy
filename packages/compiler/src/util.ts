import {CompilerConfig, CompilerUnit, CompilerUnitTransformer} from "./public_api";

export function crateCompilationUnit(name: string, content: string, path: string = null): CompilerUnit {
    return {name, path, content}
}

export function crateCompilerConfig(...transformer: Array<CompilerUnitTransformer>): CompilerConfig {
    return crateCompilerConfigFromArray(transformer);
}

export function crateCompilerConfigFromArray(transformer: Array<CompilerUnitTransformer>): CompilerConfig {
    return {transformers: transformer}
}

export function replaceRange(input: string, start: number, end: number, text: string): string {
    return input.substring(0, start) + text + input.substring(end);
}

export function extractClassName(value): string {
    return value.split('.').pop();
}