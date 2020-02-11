import * as ts from "typescript";
import {ComponentTranspiler} from "./component-transpiler";
import {ValueObject} from "../transpiler/model";
import {TemplateTranspilerContext} from "./template-transpiler-context";
import {addOrUpdateObjectProperty, objectGetPropertyText, objectHasProperty, removeObjectProperty} from "../object";
import {ComponentProperties} from "./component-properties";
import {readFile, resolvePath} from "../filesystem";

export class TemplateLoaderComponentTranspiler implements ComponentTranspiler {
    transpile(config: ValueObject, context: TemplateTranspilerContext): ValueObject {
        if (context.config.template.load && objectHasProperty(config, ComponentProperties.TEMPLATE_URL)) {
            return addOrUpdateObjectProperty(
                removeObjectProperty(config, ComponentProperties.TEMPLATE_URL),
                ComponentProperties.TEMPLATE,
                '`' + loadHtmlTemplate(context.path, objectGetPropertyText(config, ComponentProperties.TEMPLATE_URL)) + '`',
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
