import * as ts from "typescript";
import {ComponentTranspiler} from "./component-transpiler";
import {SupportedComponentProperties, ValueObject} from "../public_api";
import {TemplateTranspilerContext} from "./template-transpiler-context";
import {addOrUpdateObjectProperty, objectGetPropertyText, objectHasProperty} from "../object";

export class TemplateOptimiseComponentTranspiler implements ComponentTranspiler {
    transpile(config: ValueObject, context: TemplateTranspilerContext): ValueObject {
        if (context.config.template.optimize && objectHasProperty(config, SupportedComponentProperties.template)) {
            return addOrUpdateObjectProperty(
                config,
                SupportedComponentProperties.template,
                removeHtmlWhitespaces(objectGetPropertyText(config, SupportedComponentProperties.template)),
                ts.SyntaxKind.StringLiteral
            )
        }
        return config;
    }
}

export function removeHtmlWhitespaces(html: string): string {
    return html
        .replace(/\n/g, '')
        .replace(/\>\s+\</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
}
