import {TemplateExpressionResolver} from "./template-expression-resolver";
import {TemplateExpressionParser} from "./template-expression-parser";
import {AstVisitor} from "./ast";

export class CtrlTemplateExpressionResolver implements TemplateExpressionResolver {
    constructor(private visitor: AstVisitor) {
    }

    resolve(expression: string): string {
        return new TemplateExpressionParser().parse(expression)
            .map(ast => ast.visit(this.visitor))
            .join('');
    }
}



