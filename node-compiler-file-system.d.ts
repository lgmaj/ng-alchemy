import { CompilerFileSystem } from "../public_api";
export declare class NodeCompilerFileSystem implements CompilerFileSystem {
    readFile(filePath: string): string;
    resolvePath(catalog: string, file: string): string;
}
