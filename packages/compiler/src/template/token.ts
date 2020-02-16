export enum TokenType {
    IDENTIFIER,
    KEYWORD,
    OPERATOR,
    ANY
}

export class Token {
    private constructor(readonly text: string,
                        readonly type: TokenType) {
    }

    isIdentifier() : boolean {
        return this.type === TokenType.IDENTIFIER;
    }

    isOperatorDot() : boolean {
        return this.type === TokenType.OPERATOR && this.text === '.';
    }

    static any(text: string): Token {
        return new Token(text, TokenType.ANY)
    }

    static operator(text: string): Token {
        return new Token(text, TokenType.OPERATOR)
    }

    static keyword(text: string): Token {
        return new Token(text, TokenType.KEYWORD)
    }

    static identifier(text: string): Token {
        return new Token(text, TokenType.IDENTIFIER)
    }
}
