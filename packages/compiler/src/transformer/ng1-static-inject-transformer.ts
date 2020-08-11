import {CompilerUnitTransformer, SourceTransformation, SupportedDecorators} from "../public_api";
import {extractClassName} from "../util";
import * as ts from 'typescript';
import {TSTranspilerData} from "../transpiler/model";
import {add, remove} from "../transformation";

export class Ng1StaticInjectTransformer implements CompilerUnitTransformer {
    transform(data: TSTranspilerData): Array<SourceTransformation> {
        const result: Array<SourceTransformation> = [];
        data.classList.forEach(c => {
            const staticInject: Array<string> = [];
            c.constructorParameterDecorator
                .filter(d => d.name === SupportedDecorators.Inject)
                .forEach(
                    d => {
                        let type: string = null;

                        if (d.args.length === 0) {
                            if (d.parameter.type && d.parameter.type !== 'any') {
                                type = extractClassName(d.parameter.type);
                            } else {
                                type = d.parameter.name;
                            }
                        } else if (d.args.length === 1) {
                            if (d.args[0].kind === ts.SyntaxKind.StringLiteral)
                                type = d.args[0].text.substr(1, d.args[0].text.length - 2);
                            else
                                type = extractClassName(d.args[0].text);
                        }

                        if (type) {
                            staticInject.push(type);
                            result.push(remove(d))
                        }
                    });
            if (staticInject.length > 0) {
                result.push(add(
                    `static $inject:Array<string> = [${staticInject.map(i => `'${i}'`).join(',')}];`,
                    c.end - 1
                ));
            }
        });
        return result;
    }
}
