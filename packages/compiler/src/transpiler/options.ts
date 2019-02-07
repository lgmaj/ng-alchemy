import * as ts from "typescript";

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