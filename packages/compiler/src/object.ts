import {ValueObject, ValueObjectProperty} from "./transpiler/model";
import {SourceTransformation} from "./public_api";
import {add, update} from "./transformation";
import * as ts from "typescript";


export function valeObjectToString(o: ValueObject): string {
    return `{${o.properties.map(p => `${p.name.text}:${p.initializer.text}`).join(',')}}`;
}

export function removeObjectProperty(o: ValueObject, name: string): ValueObject {
    return new ValueObject(o.start, o.end, o.properties.filter(p => p.name.text !== name));
}

export function addOrUpdateObjectPropertys(o: ValueObject, properties: Array<{ name: string, value: string }>): ValueObject {
    return new ValueObject(o.start, o.end,
        o.properties
            .filter(p => !properties.find(v => v.name === p.name.text))
            .concat(properties.map(p => ValueObjectProperty.fomNameInitializer(p.name, p.value)))
    );
}

export function addOrUpdateObjectProperty(o: ValueObject, name: string, value: string): ValueObject {
    return new ValueObject(o.start, o.end,
        o.properties
            .filter(p => p.name.text !== name)
            .concat([ValueObjectProperty.fomNameInitializer(name, value)])
    );
}

export function addOrUpdateObjectPropertyTransformation(o: ValueObject, name: string, value: string): SourceTransformation {
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

export function objectGetPropertyText(o: ValueObject, name: string): string {
    return objectGetProperty(o, name).initializer.text;
}

export function objectGetPropertyTextOrDefault(o: ValueObject, name: string, defaultValue: string): string {
    return objectHasProperty(o, name) ? objectGetPropertyText(o, name) : defaultValue;
}

export function isObjectLiteralExpression(node: { kind: number }): boolean {
    return node && node.kind === ts.SyntaxKind.ObjectLiteralExpression;
}