import * as ts from "typescript";
import {ComponentTranspiler} from "./component-transpiler";
import {ValueObject} from "../transpiler/model";
import {TemplateTranspilerContext} from "./template-transpiler-context";
import {addOrUpdateObjectProperty, objectGetPropertyText, objectHasPropertyKind} from "../object";
import {TemplateTranspiler} from "./template-transpiler";
import {ComponentProperties} from "./component-properties";
import {CtrlTemplateExpressionResolver} from "./ctrl-template-expression-resolver";
import {CtrlTemplateTranspilerHost} from "./ctrl-template-transpiler-host";

export class TemplateTranspilerComponentTranspiler implements ComponentTranspiler {
    transpile(config: ValueObject, context: TemplateTranspilerContext): ValueObject {
        if (context.config.template.transpile && isSupportedTemplateKain(config)) {
            return addOrUpdateObjectProperty(
                config,
                ComponentProperties.TEMPLATE,
                new TemplateTranspiler().transpile(
                    objectGetPropertyText(config, ComponentProperties.TEMPLATE),
                    new CtrlTemplateExpressionResolver(new CtrlTemplateTranspilerHost(context.clazz))
                ),
                ts.SyntaxKind.StringLiteral
            )
        }
        return config;
    }
}

// todo: add support for ts.SyntaxKind.NoSubstitutionTemplateLiteral
function isSupportedTemplateKain(config: ValueObject): boolean {
    return objectHasPropertyKind(config, ComponentProperties.TEMPLATE, ts.SyntaxKind.StringLiteral);
}
