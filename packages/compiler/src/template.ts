import * as path from "path";
import {readFileSync} from "fs";

export function loadHtmlTemplate(catalog: string, file: string): string {
    return removeWhitespaces(readHtmlTemplate(catalog, file));
}

function readHtmlTemplate(catalog: string, file: string): string {
    return readFileSync(resolveTemplatePath(catalog, file)).toString();
}

function removeWhitespaces(html: string): string {
    return html.replace(/\r?\n\s*/g, '');
}

function resolveTemplatePath(catalog: string, file: string): string {
    return path.resolve(catalog, resolveTemplateName(file))
}

function resolveTemplateName(file: string): string {
    return file.startsWith('"') || file.startsWith("'") ? file.substr(1, file.length - 2) : file;
}