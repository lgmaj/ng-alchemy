import * as ts from "typescript";
import {ComponentTranspiler} from "./component-transpiler";
import {TemplateTranspilerContext} from "./template-transpiler-context";
import {addOrUpdateObjectProperty, objectGetPropertyText, objectHasProperty, removeObjectProperty} from "../object";
import {readFile, resolvePath} from "../filesystem";
import {SupportedComponentProperties, ValueObject} from "../public_api";

export class TemplateLoaderComponentTranspiler implements ComponentTranspiler {
    transpile(config: ValueObject, context: TemplateTranspilerContext): ValueObject {
        if (context.config.template.load && objectHasProperty(config, SupportedComponentProperties.templateUrl)) {
            const templateFileName: string = objectGetPropertyText(config, SupportedComponentProperties.templateUrl);
            context.api.addDependency(resolveTemplatePath(context.path, templateFileName));
            return addOrUpdateObjectProperty(
                removeObjectProperty(config, SupportedComponentProperties.templateUrl),
                SupportedComponentProperties.template,
                '`' + loadHtmlTemplate(context.path, templateFileName) + '`',
                ts.SyntaxKind.StringLiteral
            );
        }

        return config;
    }
}

export function loadHtmlTemplate(catalog: string, file: string): string {
    return readHtmlTemplate(catalog, file);
}

function readHtmlTemplate(catalog: string, file: string): string {
    return readFile(resolveTemplatePath(catalog, file)).toString();
}

function resolveTemplatePath(catalog: string, file: string): string {
    return resolvePath(catalog, resolveTemplateName(file))
}

function resolveTemplateName(file: string): string {
    return file.startsWith('"') || file.startsWith("'") ? file.substr(1, file.length - 2) : file;
}
