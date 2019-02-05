import * as ts from "typescript";
import {CompilerUnit} from "../public_api";
import {FileSystemMock} from "./FileSystemMock";
import {CompilerHostMock} from "./CompilerHostMock";

export function createProgram(compilerUnit: CompilerUnit, options: ts.CompilerOptions): ts.Program {
    const fileSystem = new FileSystemMock();
    fileSystem.add(compilerUnit.name, compilerUnit.content, options.target);

    return ts.createProgram([compilerUnit.name], options, new CompilerHostMock(fileSystem))
}

export function getIdentifier(node: ts.Node): string {
    return ts.isIdentifier(node) ? node.escapedText as string : null;
}


export function createTranspilerOptions(): ts.CompilerOptions {
    return {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        isolatedModules: true,
        // transpileModule does not write anything to disk so there is no need to verify that there are no conflicts between input and output paths.
        suppressOutputPathCheck: true,
        // Filename can be non-ts file.
        allowNonTsExtensions: true,
        // We are not returning a sourceFile for lib file when asked by the program,
        // so pass --noLib to avoid reporting a file not found error.
        noLib: true,
        // Clear out other settings that would not be used in transpiling this module
        lib: undefined,
        types: undefined,
        noEmit: undefined,
        noEmitOnError: undefined,
        paths: undefined,
        rootDirs: undefined,
        declaration: undefined,
        composite: undefined,
        declarationDir: undefined,
        out: undefined,
        outFile: undefined,
        // We are not doing a full typecheck, we are not resolving the whole context,
        // so pass --noResolve to avoid reporting missing file errors.
        noResolve: true
    };
}