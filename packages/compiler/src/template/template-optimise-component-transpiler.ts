import * as ts from "typescript";
import {ComponentTranspiler} from "./component-transpiler";
import {ValueObject} from "../transpiler/model";
import {TemplateTranspilerContext} from "./template-transpiler-context";
import {addOrUpdateObjectProperty, objectGetPropertyText, objectHasProperty} from "../object";
import {ComponentProperties} from "./component-properties";

export class TemplateOptimiseComponentTranspiler implements ComponentTranspiler {
    transpile(config: ValueObject, context: TemplateTranspilerContext): ValueObject {
        if (context.config.template.optimize && objectHasProperty(config, ComponentProperties.TEMPLATE)) {
            return addOrUpdateObjectProperty(
                config,
                ComponentProperties.TEMPLATE,
                removeWhitespaces(objectGetPropertyText(config, ComponentProperties.TEMPLATE)),
                ts.SyntaxKind.StringLiteral
            )
        }
        return config;
    }
}

function removeWhitespaces(html: string): string {
    return html.replace(/\r?\n\s*/g, '');
}
