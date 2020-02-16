import {Ast} from "./ast";
import {TemplateExpressionScanner} from "./template-expression-scanner";
import {TemplateExpressionTokenizer} from "./template-expression-tokenizer";

export class TemplateExpressionParser {
    parse(expression: string): Array<Ast> {
        return new TemplateExpressionScanner().scan(new TemplateExpressionTokenizer().tokenize(expression));
    }
}
