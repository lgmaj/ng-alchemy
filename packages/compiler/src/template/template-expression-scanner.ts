import {Token} from "./token";
import {Ast, AstChain, AstIdentifier} from "./ast";

export class TemplateExpressionScanner {
    scan(tokens: Array<Token>): Array<Ast> {
        const result: Array<Ast> = [];
        const length: number = tokens.length;
        let index: number = 0;

        while (index < length) {
            if (tokens[index].isIdentifier()) {
                if (index + 2 < length &&
                    tokens[index + 1].isOperatorDot() &&
                    tokens[index + 2].isIdentifier()) {
                    let chain: Array<Token> = [tokens[index], tokens[index + 1], tokens[index + 2]];
                    index += 2;

                    while (index + 2 < length &&
                    tokens[index + 1].isOperatorDot() &&
                    tokens[index + 2].isIdentifier()) {
                        chain.push(tokens[index + 1], tokens[index + 2]);
                        index += 2;
                    }

                    result.push(new AstChain(chain));

                } else {
                    result.push(new AstIdentifier(tokens[index]));
                }
            } else {
                result.push(new Ast(tokens[index]));
            }

            index++;
        }

        return result;
    }
}
