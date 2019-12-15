import {CompilerFileSystem} from "../public_api";

export class EmptyCompilerFileSystem implements CompilerFileSystem {
    readFile(value: string): string {
        throw Error(errorMessage());
    }

    resolvePath(catalog: string, file: string): string {
        throw Error(errorMessage());
    }
}

function errorMessage(): string {
    return 'Not Implemented! In runtime you should use NodeCompilerFileSystem in test MockCompilerFileSystem.'
}
