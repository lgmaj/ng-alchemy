import {TSTranspilerDataConfig, ValueObject} from "../transpiler/model";
import {loadTemplate, optimiseTemplate, transpileTemplate} from "./utils";

export function compileTemplate(vo: ValueObject, path: string, config: TSTranspilerDataConfig): ValueObject {
    return [loadTemplate, transpileTemplate, optimiseTemplate].reduce((object, mutator) => mutator(object, path, config), vo);
}