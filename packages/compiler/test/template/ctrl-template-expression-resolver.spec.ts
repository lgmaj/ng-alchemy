import {CtrlTemplateExpressionResolver} from "../../src/template/ctrl-template-expression-resolver";
import {ClassPropertyData} from "../../src/transpiler/model";

describe('ctrl-template-expression-resolver', () => {
    it('should return empty string for empty input', () => {
        expect(resolver('')).toEqual('');
    });

    it('should resolve fields from host', () => {
        expect(resolver('foo', host(['foo']))).toEqual('$ctrl.foo');
        expect(resolver('foo + bar', host(['foo', 'bar']))).toEqual('$ctrl.foo+$ctrl.bar');
    });

    it('should not resolve fields if they not in host', () => {
        expect(resolver('foo', host())).toEqual('foo');
        expect(resolver('foo + bar', host(['foo']))).toEqual('$ctrl.foo+bar');
    });

    it('should resolve method if is in host', () => {
        expect(resolver('foo()', host([], ['foo']))).toEqual('$ctrl.foo()');
    });

    it('should resolve method and param form if is in host', () => {
        expect(resolver('foo(bar)', host(['bar'], ['foo']))).toEqual('$ctrl.foo($ctrl.bar)');
    });
});

function resolver(expression: string, classHost ?: TemplateTranspilerHost) {
    return new CtrlTemplateExpressionResolver(classHost || host()).resolve(expression);
}

function host(fields ?: Array<string>, methods ?: Array<string>): TemplateTranspilerHost {
    return new MockClassTemplateTranspilerHost(
        fields || ['field1', 'field2', 'field3'],
        methods || ['method1', 'method2', 'method3']
    );
}

class MockClassTemplateTranspilerHost implements TemplateTranspilerHost {

    constructor(private properties: Array<string> = [],
                private methods: Array<string> = []) {
    }

    has(name: string): boolean {
        return this.hasProperty(name) || this.hasMethod(name);
    }

    hasProperty(name: string): boolean {
        return this.properties.some(property => property === name);
    }

    hasMethod(name: string): boolean {
        return this.methods.some(method => method === name);
    }
}
