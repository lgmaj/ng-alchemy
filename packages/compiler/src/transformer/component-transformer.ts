import {
    CompilerUnitTransformer,
    DecoratorData,
    PropertyDecoratorData,
    SourceTransformation,
    SupportedDecorators,
    TSTranspilerClassData,
    TSTranspilerData,
    ValueObject
} from "../public_api";
import {add, remove} from "../transformation";
import {compileTemplate} from '../template';
import {addOrUpdateObjectProperty, isObjectLiteralExpression, valeObjectToString} from "../object";
import {TemplateTranspilerContext} from "../template/template-transpiler-context";

export class ComponentTransformer implements CompilerUnitTransformer {
    transform(data: TSTranspilerData): Array<SourceTransformation> {
        const result: Array<SourceTransformation> = [];
        data.classList.forEach(c =>
            c.decorator
                .filter(d => this.isComponentDecorator(d))
                .forEach(d => {
                        c.propertyDecorator
                            .filter(d2 => d2.name === SupportedDecorators.Input || d2.name === SupportedDecorators.Output)
                            .forEach(d2 => {
                                result.push(remove(d2));
                            });
                        result.push(
                            remove(d),
                            add(this.ngComponentDef(this.createDef(d.args[0].value as ValueObject, c, data)), c.end - 1)
                        );
                    }
                )
        );
        return result;
    }

    private createDef(v: ValueObject, c: TSTranspilerClassData, data: TSTranspilerData): string {
        return valeObjectToString(
            this.loadTemplate(
                this.setController(this.setBindings(v, this.getBindings(c)), c),
                TemplateTranspilerContext.create(c, data))
        );
    }

    private loadTemplate(config: ValueObject, context: TemplateTranspilerContext): ValueObject {
        return compileTemplate(config, context);
    }

    private setBindings(value: ValueObject, bindings: Array<string>): ValueObject {
        return bindings.length > 0 ? addOrUpdateObjectProperty(value, 'bindings', `{${bindings.join(',')}}`) : value;
    }

    private setController(value: ValueObject, c: TSTranspilerClassData): ValueObject {
        return addOrUpdateObjectProperty(value, 'controller', c.name);
    }

    private getBindings(c: TSTranspilerClassData): Array<string> {
        return c.propertyDecorator
            .filter(p => p.name === SupportedDecorators.Input || p.name === SupportedDecorators.Output)
            .map(p => `${p.propert.name}:${this.getBind(p)}`);
    }

    private getBind(p: PropertyDecoratorData): string {
        return p.args.length === 1 ? p.args[0].text : p.name === SupportedDecorators.Input ? `'<'` : `'&'`;
    }

    private isComponentDecorator(d: DecoratorData): boolean {
        return d.name === SupportedDecorators.Component && d.args.length === 1 && isObjectLiteralExpression(d.args[0])
    }

    private ngComponentDef(def: string): string {
        return `static ngComponentDef:any = ${def};`
    }
}
