import {TSTranspilerData} from "./transpiler/model";

export * from "./transpiler/public_api";

export enum SupportedDecorators {
    Component = 'Component',
    Injectable = 'Injectable',
    Inject = 'Inject',
    NgModule = 'NgModule',
    Input = 'Input',
    Output = 'Output',
    Pipe = 'Pipe'
}

export enum SupportedComponentProperties {
    bindings = 'bindings',
    template = 'template',
    templateUrl = 'templateUrl'
}

export interface CompilerUnit {
    name: string;
    path: string;
    content: string;
    templateUrlPath?: string;
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

    equal(value: SourceTransformation): boolean {
        return this.start === value.start &&
            this.end === value.end &&
            this.text === value.text;
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
