import {CompilerFileSystem} from "../public_api";
import {EmptyCompilerFileSystem} from "./empty-compiler-file-system";

let FILE_SYSTEM: CompilerFileSystem = new EmptyCompilerFileSystem();

export function registerCompilerFileSystem(fileSystem: CompilerFileSystem): void {
    FILE_SYSTEM = fileSystem;
}

export function readFile(value: string): string {
    return FILE_SYSTEM.readFile(value);
}

export function resolvePath(catalog: string, file: string): string {
    return FILE_SYSTEM.resolvePath(catalog, file);
}