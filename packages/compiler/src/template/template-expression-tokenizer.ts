import {Token} from "./token";

export class TemplateExpressionTokenizer {

    private tokens: Array<Token> = [];
    private index: number = 0;
    private current: string = '';

    tokenize(input: string): Array<Token> {
        const size: number = input.length;
        while (this.index < size) {
            if (isEmptyString(this.read(input))) {
                this.addCurrentToken();
                this.moveNextIndex();
            } else if (isOperator(this.read(input))) {
                this.addCurrentToken();
                this.addToken(Token.operator(this.read(input)));
                this.moveNextIndex();
            } else {
                this.readCurrent(input);
                this.moveNextIndex();
            }
        }
        this.addCurrentToken();
        return this.tokens;
    }

    private addCurrentToken(): void {
        if (this.current.length > 0) {
            this.addToken(toToken(this.current));
        }
    }

    private addToken(token: Token): void {
        this.tokens.push(token);
        this.current = '';
    }

    private readCurrent(input: string): void {
        this.current += this.read(input);
    }

    private read(input: string): string {
        return input[this.index];
    }

    private moveNextIndex(): void {
        this.index++;
    }
}

function toToken(input: string): Token {
    if (isKeywordString(input)) {
        return Token.keyword(input)
    }

    if (isIdentifierString(input)) {
        return Token.identifier(input);
    }

    return Token.any(input);
}

function isIdentifierString(input: string): boolean {
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*/.test(input);
}

function isEmptyString(char: string): boolean {
    return char === ' ';
}

function isKeywordString(identifier: string): boolean {
    return ['true', 'false'].indexOf(identifier) > -1;
}

function isOperator(char: string): boolean {
    return [
        '+', '-', '*', '/', '=', '.', ',',
        '!', '?', ':', '&', '|',
        '(', ')', '[', ']', '{', '}'
    ].indexOf(char) > -1;
}
