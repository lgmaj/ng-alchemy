import {Ast, AstChain, AstVisitor} from "./ast";

export class CtrlTemplateAstVisitor implements AstVisitor {
    constructor(private host: TemplateTranspilerHost) {
    }

    visit(ast: Ast): string {
        return this.isFromCtrl(ast) ? $ctrl(ast) : ast.token.text;
    }

    visitChain(ast: AstChain): string {
        return (this.isFromCtrl(ast) ? ['$ctrl', '.'] : [])
            .concat(ast.tokens.map(token => token.text))
            .join('');
    }

    private isFromCtrl(ast: Ast): boolean {
        return this.host.has(ast.token.text);
    }
}

function $ctrl(ast: Ast): string {
    return `$ctrl.${ast.token.text}`;
}
