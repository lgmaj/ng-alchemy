import {TemplateExpressionParser} from "../../src/template/template-expression-parser";

describe('template-expression-parser', () => {
    it('should return token form expresion', () => {
        expect(parse('foo')).toEqual(['foo']);
        expect(parse('foo + bar')).toEqual(['foo', '+', 'bar']);
        expect(parse('foo + bar - 2')).toEqual(['foo', '+', 'bar', '-', '2']);
        expect(parse('foo+bar')).toEqual(['foo', '+', 'bar']);
        expect(parse('foo+bar-2')).toEqual(['foo', '+', 'bar', '-', '2']);
    });

    it('should parse chain', () => {
        expect(parse('a.bb.ccc.ddd')).toEqual(['a', '.', 'bb', '.', 'ccc', '.', 'ddd']);
    });

    it('should parse function call', () => {
        expect(parse('foo()')).toEqual(['foo', '(', ')']);
        expect(parse('foo(a)')).toEqual(['foo', '(', 'a', ')']);
        expect(parse('foo(a,b)')).toEqual(['foo', '(', 'a', ',', 'b', ')']);
    });

    it('should parse numbers', () => {
        expect(parse('1 + 2 + 3')).toEqual(['1', '+', '2', '+', '3']);
    });
});

function parse(expresion: string): Array<string> {
    return new TemplateExpressionParser().parse(expresion);
}
