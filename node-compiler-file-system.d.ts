import { CompilerFileSystem } from './dist/compiler';
export declare class NodeCompilerFileSystem implements CompilerFileSystem {
    readFile(filePath: string): string;
    resolvePath(catalog: string, file: string): string;
}
