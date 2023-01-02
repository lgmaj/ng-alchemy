import * as ts from "typescript";
import {CompilerUnit} from "../public_api";
import {FileSystemMock} from "./file-system-mock";
import {CompilerHostMock} from "./compiler-host-mock";

export function createProgram(compilerUnit: CompilerUnit, options: ts.CompilerOptions): ts.Program {
    const fileSystem = new FileSystemMock();
    fileSystem.add(compilerUnit.name, compilerUnit.content, options.target);

    return ts.createProgram([compilerUnit.name], options, new CompilerHostMock(fileSystem))
}

export function getIdentifier(node: ts.Node): string {
    return ts.isIdentifier(node) ? node.escapedText as string : null;
}

export function getModifiers(node: ts.Node): Array<number> {
    return ts.canHaveModifiers(node) ? (ts.getModifiers(node) || []).map(m => m.kind) : [];
}

export function getDecorators(node: ts.Node): ReadonlyArray<ts.Decorator> {
    return ts.canHaveDecorators(node) ? ts.getDecorators(node) || [] : [];
}

export function getHeritageClauses(node: ts.ClassDeclaration, kind: ts.SyntaxKind): Array<string> {
    return node.heritageClauses ? node.heritageClauses
        .filter(h => h.token === kind)
        .map(h => h.types)
        .map(types => types.map(type => getIdentifier(type.expression)))
        .reduce((a, c) => a.concat(c), []) : []
}

export function first<T>(values: Array<T>): T | undefined {
    return values && values.length ? values[0] : undefined;
}