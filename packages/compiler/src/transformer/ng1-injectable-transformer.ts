import {CompilerUnitTransformer, SourceTransformation, SupportedDecorators} from "../public_api";
import {TSTranspilerData} from "../transpiler/model";
import {update} from "../transformation";

export class Ng1InjectableTransformer implements CompilerUnitTransformer {
    transform(data: TSTranspilerData): Array<SourceTransformation> {
        const result: Array<SourceTransformation> = [];
        data.classList.forEach(c =>
            c.decorator.filter(d => d.name === SupportedDecorators.Injectable && d.args.length === 0).forEach(d => {
                    result.push(update(`@${SupportedDecorators.Injectable}('${c.name}')`, d))
                }
            )
        );
        return result;
    }
}
