import * as ts from "typescript";
import {CompilerUnit, SourceTransformation} from "../public_api";
import {FileSystemMock} from "./FileSystemMock";
import {CompilerHostMock} from "./CompilerHostMock";
import {ValueObject, ValueObjectProperty} from "./model";
import {add, update} from "../transformation";

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

export function addOrUpdateObjectProperty(o: ValueObject, name: string, value: string): SourceTransformation {
    if (objectHasProperty(o, name)) {
        return update(`${name}:${value}`, objectGetProperty(o, name));
    }

    return add(o.properties.length > 0 ? `,${name}:${value}` : `${name}:${value}`, o.end - 1);
}

export function objectHasProperty(o: ValueObject, name: string): boolean {
    return !!objectGetProperty(o, name);
}

export function objectGetProperty(o: ValueObject, name: string): ValueObjectProperty {
    return o.properties.find(p => p.name.text === name)
}

export function isObjectLiteralExpression(node: { kind: number }): boolean {
    return node && node.kind === ts.SyntaxKind.ObjectLiteralExpression;
}