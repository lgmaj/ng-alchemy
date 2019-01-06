import {TSTranspilerData} from "./transpiler";

export interface CompilerUnit {
    name: string;
    content: string;
}

export interface CompilerUnitTransformer {
    transform(content: TSTranspilerData): Array<SourceTransformation>;
}

export class SourceTransformation {
    constructor(
        readonly start: number,
        readonly end: number,
        readonly text: string,
    ) {
    }
}

export interface CompilerConfig {
    transformers: Array<CompilerUnitTransformer>;
}