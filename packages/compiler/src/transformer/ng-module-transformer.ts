import {CompilerUnitTransformer, SourceTransformation, SupportedDecorators} from "../public_api";
import {TSTranspilerData} from "../transpiler/model";
import {add, remove} from "../transformation";

export class NgModuleTransformer implements CompilerUnitTransformer {
    transform(data: TSTranspilerData): Array<SourceTransformation> {
        const result: Array<SourceTransformation> = [];
        data.classList.forEach(c =>
            c.decorator.filter(d => d.name === SupportedDecorators.NgModule).forEach(d => {
                    result.push(
                        remove(d),
                        add(`static ngModuleDef:any = ${d.args[0].text};`, c.end - 1)
                    );
                }
            )
        );
        return result;
    }
}
