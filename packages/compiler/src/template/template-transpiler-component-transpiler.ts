import * as ts from "typescript";
import {ComponentTranspiler} from "./component-transpiler";
import {SupportedComponentProperties, ValueObject} from "../public_api";
import {TemplateTranspilerContext} from "./template-transpiler-context";
import {addOrUpdateObjectProperty, objectGetPropertyText, objectHasPropertyKind} from "../object";
import {TemplateTranspiler} from "./template-transpiler";
import {CtrlTemplateExpressionResolver} from "./ctrl-template-expression-resolver";
import {CtrlTemplateTranspilerHost} from "./ctrl-template-transpiler-host";
import {CtrlTemplateAstVisitor} from "./ctrl-template-ast-visitor";

export class TemplateTranspilerComponentTranspiler implements ComponentTranspiler {
    transpile(config: ValueObject, context: TemplateTranspilerContext): ValueObject {
        if (context.config.template.transpile && isSupportedTemplateKain(config)) {
            return addOrUpdateObjectProperty(
                config,
                SupportedComponentProperties.template,
                new TemplateTranspiler().transpile(
                    objectGetPropertyText(config, SupportedComponentProperties.template),
                    new CtrlTemplateExpressionResolver(
                        new CtrlTemplateAstVisitor(new CtrlTemplateTranspilerHost(context.clazz))
                    )
                ),
                ts.SyntaxKind.StringLiteral
            )
        }
        return config;
    }
}

function isSupportedTemplateKain(config: ValueObject): boolean {
    return objectHasPropertyKind(config, SupportedComponentProperties.template, ts.SyntaxKind.StringLiteral) ||
        objectHasPropertyKind(config, SupportedComponentProperties.template, ts.SyntaxKind.NoSubstitutionTemplateLiteral);
}
