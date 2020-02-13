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
                removeWhitespaces(objectGetPropertyText(config, SupportedComponentProperties.template)),
                ts.SyntaxKind.StringLiteral
            )
        }
        return config;
    }
}

function removeWhitespaces(html: string): string {
    return html.replace(/\r?\n\s*/g, '');
}
