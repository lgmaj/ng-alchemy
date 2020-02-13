import {
    CompilerUnitTransformer,
    DecoratorData,
    PropertyDecoratorData,
    SourceTransformation,
    SupportedComponentProperties,
    SupportedDecorators,
    TSTranspilerClassData,
    TSTranspilerData,
    ValueObject
} from "../public_api";
import {remove, update} from "../transformation";
import {addOrUpdateObjectProperty, isObjectLiteralExpression, valeObjectToString} from "../object";
import {TemplateTranspilerContext} from "../template/template-transpiler-context";
import {compileTemplate} from "../template";

export class Ng1ComponentTransformer implements CompilerUnitTransformer {
    transform(data: TSTranspilerData): Array<SourceTransformation> {
        return data.classList.reduce<Array<SourceTransformation>>(
            (accumulator: Array<SourceTransformation>, clazz: TSTranspilerClassData, index: number) => {
                return accumulator.concat(clazz.decorator
                    .filter(this.isValidDecorator.bind(this))
                    .map(d => d.args[0].value as ValueObject)
                    .map(vo => this.setBindings(vo, this.getBindings(clazz, accumulator)))
                    .map(vo => compileTemplate(vo, TemplateTranspilerContext.create(clazz, data)))
                    .map(vo => update(valeObjectToString(vo), vo)));
            }, []);
    }

    private setBindings(vo: ValueObject, bindings: Array<string>): ValueObject {
        return bindings.length > 0 ?
            addOrUpdateObjectProperty(vo, SupportedComponentProperties.bindings, `{${bindings.join(',')}}`) :
            vo;
    }

    private getBindings(c: TSTranspilerClassData, result: Array<SourceTransformation>): Array<string> {
        return c.propertyDecorator
            .filter(p => p.name === SupportedDecorators.Input || p.name === SupportedDecorators.Output)
            .map(p => {
                result.push(remove(p));
                return `${p.propert.name}:${this.getBind(p)}`
            });
    }

    private getBind(p: PropertyDecoratorData): string {
        return p.args.length === 1 ? p.args[0].text : p.name === SupportedDecorators.Input ? `'<'` : `'&'`;
    }

    protected isValidDecorator(decorator: DecoratorData): boolean {
        return this.isComponent(decorator.name) &&
            decorator.args.length === 1 &&
            isObjectLiteralExpression(decorator.args[0])
    }

    protected isComponent(name: string): boolean {
        return name === SupportedDecorators.Component;
    }
}
