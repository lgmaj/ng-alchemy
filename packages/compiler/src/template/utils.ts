import {readFile, resolvePath} from "../filesystem";
import {TSTranspilerDataConfig, ValueObject} from "../transpiler/model";
import {addOrUpdateObjectProperty, objectGetPropertyText, objectHasProperty, removeObjectProperty} from "../object";

enum DefProperty {
    TEMPLATE = 'template',
    TEMPLATE_URL = 'templateUrl'
}

export function loadTemplate(o: ValueObject, filePath: string, config: TSTranspilerDataConfig): ValueObject {
    if (config.template.load && objectHasProperty(o, DefProperty.TEMPLATE_URL)) {
        return addOrUpdateObjectProperty(
            removeObjectProperty(o, DefProperty.TEMPLATE_URL),
            DefProperty.TEMPLATE,
            '`' + loadHtmlTemplate(filePath, objectGetPropertyText(o, DefProperty.TEMPLATE_URL)) + '`'
        );
    }

    return o;
}

export function transpileTemplate(o: ValueObject, filePath: string, config: TSTranspilerDataConfig): ValueObject {
    if (config.template.transpile && objectHasProperty(o, DefProperty.TEMPLATE)) {
    }
    return o;
}

export function optimiseTemplate(o: ValueObject, filePath: string, config: TSTranspilerDataConfig): ValueObject {
    if (config.template.optimize && objectHasProperty(o, DefProperty.TEMPLATE)) {
        return addOrUpdateObjectProperty(o, DefProperty.TEMPLATE, removeWhitespaces(objectGetPropertyText(o, DefProperty.TEMPLATE)))
    }
    return o;
}

export function loadHtmlTemplate(catalog: string, file: string): string {
    return readHtmlTemplate(catalog, file);
}

function readHtmlTemplate(catalog: string, file: string): string {
    return readFile(resolveTemplatePath(catalog, file)).toString();
}

function removeWhitespaces(html: string): string {
    return html.replace(/\r?\n\s*/g, '');
}

function resolveTemplatePath(catalog: string, file: string): string {
    return resolvePath(catalog, resolveTemplateName(file))
}

function resolveTemplateName(file: string): string {
    return file.startsWith('"') || file.startsWith("'") ? file.substr(1, file.length - 2) : file;
}