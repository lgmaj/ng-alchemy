import {Token} from "./token";


export interface AstVisitor {
    visit(ast: Ast): string;
    visitChain(ast: AstChain): string;
}

export class Ast {
    constructor(readonly token: Token) {
    }

    visit(visitor: AstVisitor): string {
        return this.token.text;
    }
}

export class AstIdentifier extends Ast {

    visit(visitor: AstVisitor): string {
        return visitor.visit(this);
    }
}

export class AstChain extends Ast {

    constructor(readonly tokens: Array<Token>) {
        super(tokens[0]);
    }

    visit(visitor: AstVisitor): string {
        return visitor.visitChain(this);
    }
}
