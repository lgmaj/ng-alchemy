import {TemplateExpressionResolver} from "./template-expression-resolver";
import {TemplateExpressionParser} from "./template-expression-parser";

export class CtrlTemplateExpressionResolver implements TemplateExpressionResolver {
    constructor(private host: TemplateTranspilerHost) {
    }

    resolve(expression: string): string {
        return new TemplateExpressionParser()
            .parse(expression)
            .map(token => this.host.has(token) ? $ctrl(token) : token)
            .join('');
    }
}

function $ctrl(expresion: string): string {
    return `$ctrl.${expresion}`;
}


