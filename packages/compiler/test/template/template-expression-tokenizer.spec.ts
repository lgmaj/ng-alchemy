import {TemplateExpressionTokenizer} from "../../src/template/template-expression-tokenizer";

describe('template-expression-tokenizer', () => {
    it('should tokenize chain', () => {
        expect(tokenize('a.bb.ccc.ddd')).toEqual(['a', '.', 'bb', '.', 'ccc', '.', 'ddd']);
    });
});

function tokenize(expresion: string): Array<string> {
    return new TemplateExpressionTokenizer().tokenize(expresion).map(token => token.text);
}
