import {TSTranspilerData} from "./transpiler/model";

export interface CompilerUnit {
    name: string;
    path: string;
    content: string;
}

export interface CompilerUnitTransformer {
    transform(data: TSTranspilerData): Array<SourceTransformation>;
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