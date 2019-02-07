import {CompilerUnitTransformer, SourceTransformation} from "../public_api";
import {TSTranspilerData} from "../transpiler/model";
import {update} from "../transformation";

export class Ng1InjectableTransformer implements CompilerUnitTransformer {
    transform(data: TSTranspilerData): Array<SourceTransformation> {
        const result: Array<SourceTransformation> = [];
        data.classList.forEach(c =>
            c.decorator.filter(d => d.name === 'Injectable' && d.args.length === 0).forEach(d => {
                    result.push(update(`@Injectable('${c.name}')`, d))
                }
            )
        );
        return result;
    }

}