import {CompilerUnitTransformer, SourceTransformation} from "../public_api";
import {PropertyDecoratorData, TSTranspilerClassData, TSTranspilerData, ValueObject} from "../transpiler/model";
import {addOrUpdateObjectProperty, isObjectLiteralExpression} from "../transpiler/util";
import {remove} from "../transformation";

export class Ng1ComponentTransformer implements CompilerUnitTransformer {
    transform(data: TSTranspilerData): Array<SourceTransformation> {
        const result: Array<SourceTransformation> = [];
        data.classList.forEach(c =>
            c.decorator
                .filter(
                    d => d.name === 'Component' &&
                        d.args.length === 1 &&
                        isObjectLiteralExpression(d.args[0])
                )
                .map(d => d.args[0].value as ValueObject)
                .map(v => this.setBindings(v, this.getBindings(c, result)))
                .filter(t => !!t)
                .forEach(t => result.push(t))
        );
        return result;
    }

    private setBindings(value: ValueObject, bindings: Array<string>): SourceTransformation {
        return bindings.length > 0 ? addOrUpdateObjectProperty(value, 'bindings', `{${bindings.join(',')}}`) : null;
    }

    private getBindings(c: TSTranspilerClassData, result: Array<SourceTransformation>): Array<string> {
        return c.propertyDecorator
            .filter(p => p.name === 'Input' || p.name === 'Output')
            .map(p => {
                result.push(remove(p));
                return `${p.propert.name}:${this.getBind(p)}`
            });
    }

    private getBind(p: PropertyDecoratorData): string {
        return p.args.length === 1 ? p.args[0].text : p.name === 'Input' ? `'<'` : `'&'`;
    }
}