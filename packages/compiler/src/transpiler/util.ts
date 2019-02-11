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

export function getModifiers(node: ts.Node): Array<number> {
    return node.modifiers ? node.modifiers.map(m => m.kind) : [];
}