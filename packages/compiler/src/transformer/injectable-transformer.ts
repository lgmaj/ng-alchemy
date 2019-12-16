import {CompilerUnitTransformer, SourceTransformation} from "../public_api";
import {DecoratorData, TSTranspilerClassData, TSTranspilerData, ValueObject} from "../transpiler/model";
import {add, remove} from "../transformation";
import {objectGetProperty, objectHasProperty} from "../object";

export class InjectableTransformer implements CompilerUnitTransformer {
    transform(data: TSTranspilerData): Array<SourceTransformation> {
        const result: Array<SourceTransformation> = [];
        data.classList.forEach(c =>
            c.decorator.filter(d => d.name === 'Injectable').forEach(d => {
                    result.push(
                        remove(d),
                        add(`static ngInjectableDef:any = {name:${this.getName(c, d)}};`, c.end - 1)
                    )
                }
            )
        );
        return result;
    }

    private getName(c: TSTranspilerClassData, d: DecoratorData): string {
        if (d.args.length === 1 && objectHasProperty(d.args[0].value as ValueObject, 'name')) {
            return objectGetProperty(d.args[0].value as ValueObject, 'name').initializer.text
        }
        return `'${c.name}'`;
    }
}