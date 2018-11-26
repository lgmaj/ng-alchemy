interface CompilerUnit {
    name: string;
    content: string;
}

export interface CompilerConfig {
    units: Array<CompilerUnit>
}

export function compile(config: CompilerConfig) {
    if (config) {
        // todo
    } else throw Error('config can\'t be null!');
}