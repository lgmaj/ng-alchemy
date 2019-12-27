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

export class CompilerConfig {
    constructor(public transformers: Array<CompilerUnitTransformer> = [],
                public template: CompilerTemplateConfig = new CompilerTemplateConfig()) {
    }
}

export class CompilerTemplateConfig {
    constructor(public readonly load: boolean = false,
                public readonly transpile: boolean = false,
                public readonly optimize: boolean = false) {
    }
}

export interface CompilerFileSystem {
    resolvePath(catalog: string, file: string): string;

    readFile(value: string): string;
}