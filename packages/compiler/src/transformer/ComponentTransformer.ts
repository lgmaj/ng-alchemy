import {CompilerUnitTransformer, SourceTransformation} from "../public_api";
import {
    DecoratorData,
    PropertyDecoratorData,
    TSTranspilerClassData,
    TSTranspilerData,
    ValueObject
} from "../transpiler/model";
import {add, remove} from "../transformation";
import {loadHtmlTemplate} from '../template';
import {
    addOrUpdateObjectProperty,
    isObjectLiteralExpression,
    objectGetProperty,
    objectHasProperty, removeObjectProperty,
    valeObjectToString
} from "../object";

export class ComponentTransformer implements CompilerUnitTransformer {
    transform(data: TSTranspilerData): Array<SourceTransformation> {
        const result: Array<SourceTransformation> = [];
        data.classList.forEach(c =>
            c.decorator
                .filter(d => this.isComponentDecorator(d))
                .forEach(d => {
                        c.propertyDecorator.filter(d2 => d2.name === 'Input' || d2.name === 'Output').forEach(d2 => {
                            result.push(remove(d2));
                        });
                        result.push(
                            remove(d),
                            add(`static ngComponentDef:any = ${this.createDef(d.args[0].value as ValueObject, c, data.path)};`, c.end - 1)
                        );
                    }
                )
        );
        return result;
    }

    private createDef(v: ValueObject, c: TSTranspilerClassData, path: string): string {
        return valeObjectToString(
            this.loadTemplate(
                this.setController(
                    this.setBindings(v, this.getBindings(c)),
                    c),
                path)
        );
    }

    private loadTemplate(v: ValueObject, filePath: string): ValueObject {
        if (objectHasProperty(v, 'templateUrl')) {
            return addOrUpdateObjectProperty(removeObjectProperty(v, 'templateUrl'), 'template', '`' + loadHtmlTemplate(filePath, objectGetProperty(v, 'templateUrl').initializer.text) + '`');
        }
        return v;
    }

    private setBindings(value: ValueObject, bindings: Array<string>): ValueObject {
        return bindings.length > 0 ? addOrUpdateObjectProperty(value, 'bindings', `{${bindings.join(',')}}`) : value;
    }

    private setController(value: ValueObject, c: TSTranspilerClassData): ValueObject {
        return addOrUpdateObjectProperty(value, 'controller', c.name);
    }

    private getBindings(c: TSTranspilerClassData): Array<string> {
        return c.propertyDecorator
            .filter(p => p.name === 'Input' || p.name === 'Output')
            .map(p => `${p.propert.name}:${this.getBind(p)}`);
    }

    private getBind(p: PropertyDecoratorData): string {
        return p.args.length === 1 ? p.args[0].text : p.name === 'Input' ? `'<'` : `'&'`;
    }

    private isComponentDecorator(d: DecoratorData): boolean {
        return d.name === 'Component' && d.args.length === 1 && isObjectLiteralExpression(d.args[0])
    }
}