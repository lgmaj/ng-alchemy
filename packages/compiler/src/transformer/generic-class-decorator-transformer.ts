import {CompilerUnitTransformer, SourceTransformation} from "../public_api";
import {DecoratorData, TSTranspilerClassData, TSTranspilerData} from "../transpiler/model";

export class GenericClassDecoratorTransformer implements CompilerUnitTransformer {

    constructor(private predicate: (decorator: DecoratorData) => boolean,
                private factory: (data: TSTranspilerClassData, decorator: DecoratorData) => SourceTransformation) {
    }

    transform(data: TSTranspilerData): Array<SourceTransformation> {
        const result: Array<SourceTransformation> = [];
        data.classList.forEach(c =>
            c.decorator.filter(this.predicate).forEach(d => {
                    result.push(this.factory(c, d))
                }
            )
        );
        return result;
    }
}