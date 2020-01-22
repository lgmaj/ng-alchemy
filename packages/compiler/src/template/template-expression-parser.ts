export class TemplateExpressionParser {
    parse(expression: string): Array<string> {
        return new Tokenizer().tokenize(expression);
    }
}

class Tokenizer {

    private tokens: Array<string> = [];
    private index: number = 0;
    private current: string = '';

    tokenize(input: string): Array<string> {
        const size: number = input.length;
        while (this.index < size) {
            if (isEmptyString(this.read(input))) {
                this.addCurrentToken();
                this.moveNextIndex();
            } else if (isOperator(this.read(input))) {
                this.addCurrentToken();
                this.addToken(this.read(input));
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
            this.addToken(this.current);
        }
    }

    private addToken(token: string): void {
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

function isEmptyString(char: string): boolean {
    return char === ' ';
}

function isOperator(char: string): boolean {
    return ['+', '-', '=', '.', ',', '!', '?', ':', '&', '|', '(', ')', '[', ']', '{', '}'].indexOf(char) > -1;
}


