import {CompilerUnitTransformer, SourceTransformation} from "../public_api";
import {TSTranspilerData} from "../transpiler/model";
import {add, remove} from "../transformation";

export class InjectableTransformer implements CompilerUnitTransformer {
    transform(data: TSTranspilerData): Array<SourceTransformation> {
        const result: Array<SourceTransformation> = [];
        data.classList.forEach(c =>
            c.decorator.filter(d => d.name === 'Injectable').forEach(d => {
                    result.push(
                        remove(d),
                        add(`static ngInjectableDef:any = {name:'${c.name}'};`, c.end - 1)
                    )
                }
            )
        );
        return result;
    }
}