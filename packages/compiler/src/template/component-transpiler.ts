import {ValueObject} from "../transpiler/model";
import {TemplateTranspilerContext} from "./template-transpiler-context";

export interface ComponentTranspiler {
    transpile(config: ValueObject, context: TemplateTranspilerContext): ValueObject;
}
