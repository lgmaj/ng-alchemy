import {CompilerUnitTransformer, SourceTransformation} from "../public_api";
import * as ts from 'typescript';
import {extractClassName} from "../util";
import {TSTranspilerData} from "../transpiler/model";
import {update} from "../transformation";

export class Ng1InjectTransformer implements CompilerUnitTransformer {
    transform(data: TSTranspilerData): Array<SourceTransformation> {
        const result: Array<SourceTransformation> = [];
        data.classList.forEach(c => c.constructorParameterDecorator
            .filter(d => d.name === 'Inject')
            .forEach(
                d => {
                    let type: string = null;

                    if (d.args.length === 0) {
                        if (d.parameter.type && d.parameter.type !== 'any') {
                            type = extractClassName(d.parameter.type);
                        } else {
                            type = d.parameter.name;
                        }
                    } else if (d.args.length === 1 && d.args[0].kind !== ts.SyntaxKind.StringLiteral) {
                        type = extractClassName(d.args[0].text);
                    }

                    if (type) {
                        result.push(update(`@Inject('${type}')`, d))
                    }
                }));
        return result;
    }

}